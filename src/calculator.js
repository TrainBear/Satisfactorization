import * as math from "mathjs";
import {isUndefined} from "mathjs";
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

    #isValid = false;

    constructor(rates) {
        this.#outputRates = rates.filter(r=>!r.equals(0));

        if(this.#outputRates.length <= 1){
            console.log("Too few parameters");
            return;
        }
        if(this.inputRate <= 0){
            console.log("Sum of parameters must be > 0");
            return;
        }

        this.#calculateRecursive();
        this.#isValid = true;
    }

    get rates(){
        return Array.from(this.#outputRates);
    }

    /**
     *
     * @returns {math.Fraction}
     */
    get inputRate(){
        if(isUndefined(this.#inputRate)){
            this.#calculateInputRate();
        }
        return this.#inputRate;
    }

    #calculateInputRate() {
        let sum = 0;
        this.#outputRates.forEach(r=>{sum = math.sum(sum, r)});
        this.#inputRate = sum;
    }

    get loopBacks(){
        return this.#loopBacks;
    }

    #calculateRecursive() {

        const ratios = this.#outputRates.map(r=>r.div(this.inputRate));
        const gcd = math.gcd(...ratios);
        const den = gcd.inverse().valueOf();
        const adjustedDen = den + this.#loopBacks;
        const factors = primeFactors(adjustedDen);

        for(let i=0; i<factors.length; i++){
            if (![2,3].includes(factors[i])){
                this.#loopBacks += 1;
                this.#calculateRecursive();
                return;
            }
        }

        this.#adjustedDen = adjustedDen;
        this.#den = den;
        this.#layers = factors;
    }

    /**
     *
     * @returns {Array<number>}
     */
    get layers(){
        return this.#layers;
    }

    get outputLayers(){
        // const adjustedRatios = this.#outputRates.map(rate=> {
        //     const ratio = rate.div(this.inputRate);
        //     const den = this.#den;
        //     const x = den/ratio.d;
        //     const n = ratio.n * x;
        //     const d = ratio.d * x + this.#loopBacks;
        //     return math.fraction(n,d);
        // });


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
        return outputLayers;
    }

    get isValid(){
        return this.#isValid;
    }
}