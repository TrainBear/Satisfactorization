import * as math from 'mathjs';
export default class UrlParamsManager {
    /**
     * @type {Calculator}
     */
    #calculator;

    /**
     *
     * @param calculator {Calculator}
     */
    constructor(calculator) {
        this.#calculator = calculator;
        this.#calculator.subscribeChange(this.#update.bind(this));

        // TODO: Read params from url, and put them in the calculator.
        const url = new URL(window.location.href);
        const params = url.searchParams;
        const rateCollectionString = params.get("outputRates");
        if(rateCollectionString === null){
            return; // No rates in url
        }
        this.#calculator.rates = rateCollectionString
            .split('r')
            .slice(1)
            .map(r=>math.fraction(r));
    }

    #update() {
        if(!this.#calculator.isValid){
            window.history.replaceState(null, "", "?");
            return;
        }
        const rates = this.#calculator.rates;
        let urlVariable = "?outputRates="
        rates.forEach(r=>{
            urlVariable += "r" + r.n + "/" + r.d;
        })
        window.history.replaceState(rates, "", urlVariable);
    }
}