import * as math from "mathjs";
import {number} from "mathjs";

const MAX_LOOP_BACKS = 1_000_000;
const PRIME_FACTORS_INPUT_LIMIT = 9_007_199_254_740_991;

export default class Calculator {


    /**
     * @type Array<math.Fraction>
     */
    #outputRates = [];

    /**
     * @type math.Fraction
     */
    #inputRate;

    /**
     *
     * @type {number}
     */
    #loopBacks = 0;

    #loopBackData

    /**
     * @type Array<number>
     */
    #layers;
    /**
     * @type number
     */
    #den;
    /**
     * @type number
     */
    #adjustedDen;

    /**
     *
     * @type {boolean}
     */
    #isValid = false;

    #outputNumerators;

    /**
     * @type string
     */
    #statusMessage = "Add parameters.";

    /**
     * @type Array<function>
     */
    #onChangeCallbackMethods = [];
    #noDouble = false;

    get rates() {
        return Array.from(this.#outputRates);
    }

    /**
     *
     * @param rates {Array<math.Fraction>}
     */
    set rates(rates) {

        this.#outputRates = rates.filter(r => r.n !== 0);
        this.recalculateAll();
    }

    get noDouble() {
        return this.#noDouble;
    }

    /**
     *
     * @returns {math.Fraction}
     */
    get inputRate() {
        return this.#inputRate;
    }

    get loopBacks() {
        return this.#loopBacks;
    }

    get loopBackData() {
        return this.#loopBackData;
    }

    /**
     *
     * @returns {Array<number>}
     */
    get layers() {
        return this.#layers;
    }

    get outputNumerators() {
        return this.#outputNumerators;
    }

    get isValid() {
        return this.#isValid;
    }

    get statusMessage() {
        return this.#statusMessage;
    }

    get mixedRate() {
        return this.#inputRate.mul(this.#adjustedDen).div(this.#den);
    }

    set noDouble(value) {
        this.#noDouble = value;
        this.recalculateAll();
    }

    recalculateAll() {
        try {
            this.#reset();
            // Too few parameters
            if (this.#outputRates.length < 2) {
                this.setInvalid("Too few non-zero parameters.");
                return;
            }
            // Parameters must be positive
            if (this.#outputRates.some(r => r.s === -1)) {
                this.setInvalid("Parameters must be positive.");
                return;
            }
            this.#calculateInputRate();
            if (!this.#calculateLayers()) {
                return;
            }

            this.#statusMessage = "Calculated successfully!";
            this.#isValid = true;
        } catch (e) {
            this.setInvalid("Unhandled calculation error.");
            console.error("Unhandled calculation error: " + e.message);
            throw e;
        } finally {
            this.#onChange();
        }
    }

    #calculateInputRate() {
        let sum = 0;
        this.#outputRates.forEach(r => {
            sum = math.sum(sum, r)
        });
        this.#inputRate = sum;
    }

    /**
     *
     * @returns {boolean} If operation was successful.
     */
    #calculateLayers() {

        const ratios = this.#outputRates.map(r => r.div(this.inputRate));
        const gcd = math.gcd(...ratios);
        const den = gcd.inverse().valueOf();

        let found = false;
        let loopBacks = -1;
        let adjustedDen;
        let factors;
        let loops = 0;
        while (!found) {
            if (loops++ > MAX_LOOP_BACKS) {
                this.setInvalid("Too many required loop-backs. Current limit is " + MAX_LOOP_BACKS + ". " +
                    "Are you using a rounded number? Make sure all numbers are exact.");
                return false;
            }
            loopBacks++;
            adjustedDen = den + loopBacks;
            if (adjustedDen > PRIME_FACTORS_INPUT_LIMIT) {
                this.setInvalid("Inverted GCD of rates is too big");
                return false;
            }
            factors = this.#specializedFactorize(adjustedDen);
            if (factors === null) {
                continue;
            }
            this.#loopBacks = loopBacks;
            this.#adjustedDen = adjustedDen;
            this.#den = den;
            this.#layers = factors;
            this.#calculateOutputData();
            this.#calculateLoopBackData();
            found = true;
            if (this.#noDouble) {
                found = found && !this.hasDouble();
            }

        }

        return true;
    }

    #calculateOutputData() {
        const outputData = []
        for (let i = 0; i < this.#outputRates.length; i++) {
            const lastLayerBelts = this.#lastLayerBeltsOf(this.#outputRates[i]);
            const layerComposition = this.#layerCompositionOf(lastLayerBelts);
            outputData.push({
                rate: this.#outputRates[i],
                lastLayerBelts: lastLayerBelts,
                layerComposition: layerComposition
            })
        }
        this.#outputNumerators = outputData;
    }

    /**
     *
     * @param rate {math.Fraction}
     * @returns {number}
     */
    #lastLayerBeltsOf(rate) {
        // lastLayerBelts
        const ratio = rate.div(this.inputRate);
        const den = this.#den;
        const x = den / ratio.d;
        return ratio.n * x;
    }

    /**
     *
     * @param outputNumerator {number}
     */
    #layerCompositionOf(outputNumerator) {
        let result = [];
        let a = 0;
        let l = this.#layers;
        let loopLimit = 100;
        while (a < outputNumerator) {
            let b = this.#adjustedDen;
            for (let i = 0; i < l.length; i++) {
                b /= l[i];
                if (a + b <= outputNumerator) {
                    a += b;
                    result.push(i + 1);
                    break;
                }
            }
            loopLimit--;
            if (loopLimit <= 0) {
                throw Error("Looping too much...");
            }
        }
        // result.sort((a, b) => a - b);
        return result;
    }

    #reset() {
        this.#den = undefined;
        this.#adjustedDen = undefined;
        this.#isValid = false;
        this.#loopBacks = 0;
        this.#layers = null;
        this.#outputNumerators = null;
    }

    /**
     *
     * @param message {string} The message to show the user.
     */
    setInvalid(message) {
        this.#isValid = false;
        this.#statusMessage = message;
        this.#onChange();
    }

    subscribeChange(callback) {
        this.#onChangeCallbackMethods.push(callback);
    }

    unsubscribeChange(callback) {
        const index = this.#onChangeCallbackMethods.indexOf(callback);
        if (index > -1) {
            this.#onChangeCallbackMethods.splice(index, 1);
        }
    }

    #onChange() {
        this.#onChangeCallbackMethods.forEach(f => f());
    }

    /**
     * Prime-factorizes n, but only if product n can consist of the factors of twos and threes.
     * @param n {number} the number to factorize
     * @returns {Array<number>|null} Factors if success, null otherwise.
     */
    #specializedFactorize(n) {
        let factors = [];
        while (n % 2 === 0) {
            factors.push(2);
            n /= 2;
        }
        while (n % 3 === 0) {
            factors.push(3);
            n /= 3;
        }
        if (n !== 1) {
            return null;
        }
        return factors;
    }

    #calculateLoopBackData() {
        const rate =
            math.fraction(this.#loopBacks)
                .mul(this.#inputRate)
                .div(this.#den);
        const lastLayerBelts = this.#lastLayerBeltsOf(rate);
        const layerComposition = this.#layerCompositionOf(lastLayerBelts);
        this.#loopBackData = {
            rate: rate,
            lastLayerBelts: lastLayerBelts,
            layerComposition: layerComposition
        }
    }

    hasDouble() {
        const layersLength = this.layers.length;
        let layerCompositions = this.outputNumerators.map(data => data.layerComposition);
        layerCompositions.push(this.loopBackData.layerComposition);
        layerCompositions = layerCompositions.map(lc => lc.filter(v => v !== layersLength)); // Last layer is allowed to be double.
        return layerCompositions.some(lc => new Set(lc).size !== lc.length);

    }

    propagationRounds(percentage){
        if(percentage <= 0 && percentage >= 100){
            throw new Error('Invalid propagation percentage.');
        }
        let prop = math.fraction(this.inputRate);
        let step = 0;
        const propRange = this.mixedRate;
        while(propRange.mul(percentage/100).sub(prop) >= 0){
            step++;
            prop += math.pow(
                this.inputRate.mul(this.loopBacks).div(this.#adjustedDen),
                step
            );
        }
        return step;
    }
}