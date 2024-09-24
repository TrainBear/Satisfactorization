import * as math from "mathjs";

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

    /**
     * @type {Array<number>}
     */
    #outputNumerators;

    /**
     * @type string
     */
    #statusMessage= "Add parameters.";

    /**
     * @type Array<function>
     */
    #onChangeCallbackMethods = [];
    #simpleResult = false;

    get rates(){
        return Array.from(this.#outputRates);
    }

    /**
     *
     * @param rates {Array<math.Fraction>}
     */
    set rates(rates){

        this.#outputRates = rates.filter(r=>r.n !== 0);
        this.recalculateAll();
    }

    get simpleResult(){
        return this.#simpleResult;
    }

    set simpleResult(value){
        this.#simpleResult = value;
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
            this.#calculateOutputData();
            this.#calculateLoopBackData();
            this.#statusMessage = "Calculated successfully!";
            this.#isValid = true;
        } catch (e) {
            this.setInvalid("Unhandled calculation error.");
            console.error("Unhandled calculation error: " + e.message);
        } finally {
            this.#onChange();
        }
    }

    /**
     *
     * @returns {math.Fraction}
     */
    get inputRate(){
        return this.#inputRate;
    }

    get loopBacks(){
        return this.#loopBacks;
    }

    get loopBackData(){
        return this.#loopBackData;
    }

    /**
     *
     * @returns {Array<number>}
     */
    get layers(){
        return this.#layers;
    }

    get outputNumerators(){
        return this.#outputNumerators;
    }

    get isValid(){
        return this.#isValid;
    }

    get statusMessage(){
        return this.#statusMessage;
    }

    #calculateInputRate() {
        let sum = 0;
        this.#outputRates.forEach(r=>{sum = math.sum(sum, r)});
        this.#inputRate = sum;
    }

    /**
     *
     * @returns {boolean} If operation was successful.
     */
    #calculateLayers() {

        const ratios = this.#outputRates.map(r=>r.div(this.inputRate));
        const gcd = math.gcd(...ratios);
        const den = gcd.inverse().valueOf();

        let found = false;
        let loopBacks = -1;
        let adjustedDen;
        let factors;
        let loops = 0;
        while(!found){
            loopBacks++;
            adjustedDen = den + loopBacks;
            if (adjustedDen > PRIME_FACTORS_INPUT_LIMIT){
                this.setInvalid("Inverted GCD of rates is too big");
                return false;
            }
            factors = this.#specializedFactorize(adjustedDen);
            found = factors!== null;
            if(loops++ > MAX_LOOP_BACKS){
                this.setInvalid("Too many required loop-backs. Current limit is " + MAX_LOOP_BACKS + ". " +
                    "Are you using a rounded number? Make sure all numbers are exact.");
                return false;
            }
        }

        this.#loopBacks = loopBacks;
        this.#adjustedDen = adjustedDen;
        this.#den = den;
        this.#layers = factors;
        return true;
    }

    #calculateOutputData(){
        const outputData = []
        for (let i=0; i<this.#outputRates.length; i++){
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
    #layerCompositionOf(outputNumerator){
        let result = [];
        let a = 0;
        let l = this.#layers;
        let loopLimit = 100;
        while(a < outputNumerator){
            let b = this.#adjustedDen;
            for (let i=0; i<l.length; i++){
                b /= l[i];
                if(a+b <= outputNumerator){
                    a += b;
                    result.push(i+1);
                    break;
                }
            }
            loopLimit--;
            if(loopLimit <= 0){
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
    setInvalid(message){
        this.#isValid = false;
        this.#statusMessage = message;
        this.#onChange();
    }

    subscribeChange(callback){
        this.#onChangeCallbackMethods.push(callback);
    }

    unsubscribeChange(callback){
        const index = this.#onChangeCallbackMethods.indexOf(callback);
        if (index > -1) {
            this.#onChangeCallbackMethods.splice(index, 1);
        }
    }

    #onChange(){
        this.#onChangeCallbackMethods.forEach(f=>f());
    }

    /**
     * Prime-factorizes n, but only if product n can consist of the factors of twos and threes.
     * @param n {number} the number to factorize
     * @returns {Array<number>|null} Factors if success, null otherwise.
     */
    #specializedFactorize(n){
        let factors = [];
        while(n%2===0){
            factors.push(2);
            n/=2;
        }
        if(this.#simpleResult === false){
            while(n%3===0){
                factors.push(3);
                n/=3;
            }
        }else{
            if(n%3===0){
                factors.push(3);
                n/=3;
            }

        }
        if(n!==1){
            return null;
        }
        return factors;
    }

    #calculateLoopBackData() {
        const rate =
            math.fraction(this.#loopBacks)
            .mul(this.#inputRate)
            .div(this.#den);
        console.log(rate.toFraction());
        const lastLayerBelts = this.#lastLayerBeltsOf(rate);
        const layerComposition = this.#layerCompositionOf(lastLayerBelts);
        this.#loopBackData = {
            rate: rate,
            lastLayerBelts: lastLayerBelts,
            layerComposition: layerComposition
        }
    }
}