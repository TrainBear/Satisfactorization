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
        const url = new URL(window.location.href);
        const params = url.searchParams;
        const rateCollectionString = params.get("outputRates");
        if(rateCollectionString === null){ // There are no rates in url
            window.history.replaceState(null, "", "?");
            return;
        }
        this.#calculator.rates = rateCollectionString
            .split('r')
            .slice(1)
            .map(r=>math.fraction(r));
        this.#calculator.noDouble = params.get("simple") === 'true' || params.get("noDouble") === 'true';   // 'simple' is old name
    }

    #update() {
        if(!this.#calculator.isValid){
            window.history.replaceState(null, "", "?");
            return;
        }
        const rates = this.#calculator.rates;
        let urlVariable = "?outputRates="
        rates.forEach(r=>{
            urlVariable += "r" + r.toFraction();
        })
        urlVariable += "&noDouble=" + this.#calculator.noDouble;
        window.history.replaceState(rates, "", urlVariable);
    }
}