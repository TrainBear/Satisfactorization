import * as math from "mathjs";
import {primeFactors} from 'prime-lib';

const MAX_LOOP_BACKS = 100_000;
const PRIME_FACTORS_INPUT_LIMIT = 9_007_199_254_740_991;

export default class Calculator {


    /**
     * @type Array<math.Fraction>
     */
    #outputRates;

    /**
     * @type math.Fraction
     */
    #inputRate;

    /**
     *
     * @type {number}
     */
    #loopBacks = 0;

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
    #outputLayers;

    /**
     * @type string
     */
    #statusMessage;

    get rates(){
        return Array.from(this.#outputRates);
    }

    /**
     *
     * @param rates {Array<math.Fraction>}
     */
    set rates(rates){
        this.#reset();
        this.#outputRates = rates.filter(r=>r.n !== 0);
        // Too few parameters
        if(this.#outputRates.length < 2){
            this.#statusMessage = "Too few non-zero parameters.";
            return;
        }
        // Parameters must be positive
        if(this.#outputRates.some(r=>r.s === -1)){
            this.#statusMessage = "Parameters must be positive.";
            return;
        }
        this.#calculateInputRate();
        if(!this.#calculateLayers()){
            return;
        }
        this.#calculateOutputLayers();
        this.#statusMessage = "Calculated successfully!";
        this.#isValid = true;
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

    /**
     *
     * @returns {Array<number>}
     */
    get layers(){
        return this.#layers;
    }

    get outputLayers(){
        return this.#outputLayers;
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
                this.setInvalid("Some numbers are getting too big.");
                return false;
            }
            factors = primeFactors(adjustedDen);
            found = !factors.some(f=>f!==2&&f!==3);
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

    #calculateOutputLayers(){
        const outputLayers = []
        for (let i=0; i<this.#outputRates.length; i++){
            const ratio = this.#outputRates[i].div(this.inputRate);
            const den = this.#den;
            const x = den/ratio.d;
            let a = ratio.n * x;
            outputLayers.push({
                rate: this.#outputRates[i],
                belts: a
            })
        }
        this.#outputLayers = outputLayers;
    }

    #reset() {
        this.#den = undefined;
        this.#adjustedDen = undefined;
        this.#isValid = false;
        this.#outputRates = null;
        this.#loopBacks = 0;
        this.#layers = null;
        this.#outputLayers = null;
    }

    /**
     *
     * @param message {string} The message to show the user.
     */
    setInvalid(message){
        this.#isValid = false;
        this.#statusMessage = message;
        console.warn(message);
    }
}