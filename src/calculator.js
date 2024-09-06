import * as math from "mathjs";
import {primeFactors} from 'prime-lib';


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

    get rates(){
        return Array.from(this.#outputRates);
    }

    /**
     *
     * @param rates {Array<math.Fraction>}
     */
    set rates(rates){
        this.#reset();
        this.#outputRates = rates.filter(r=>!r.equals(0));
        // Too few parameters
        if(this.#outputRates.length <= 1){
            return;
        }
        // Sum of parameters must be > 0
        if(this.inputRate <= 0){
            return;
        }
        this.#calculateInputRate();
        this.#calculateLayersRecursive();
        this.#calculateOutputLayers();
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

    #calculateInputRate() {
        let sum = 0;
        this.#outputRates.forEach(r=>{sum = math.sum(sum, r)});
        this.#inputRate = sum;
    }

    #calculateLayersRecursive() {

        const ratios = this.#outputRates.map(r=>r.div(this.inputRate));
        const gcd = math.gcd(...ratios);
        const den = gcd.inverse().valueOf();
        const adjustedDen = den + this.#loopBacks;
        const factors = primeFactors(adjustedDen);

        for(let i=0; i<factors.length; i++){
            if (![2,3].includes(factors[i])){
                this.#loopBacks += 1;
                this.#calculateLayersRecursive();
                return;
            }
        }

        this.#adjustedDen = adjustedDen;
        this.#den = den;
        this.#layers = factors;
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
}