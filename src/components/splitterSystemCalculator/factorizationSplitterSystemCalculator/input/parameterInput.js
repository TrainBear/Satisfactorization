import factory from "../../../../factory";
import {RateInputs} from "./rateInputs.js";
import SimpleResult from "./simpleResult.js";

export default class ParameterInput extends HTMLElement{

    /**
     * @type {RateInputs}
     */
    #rateInputs;
    #simpleResult;

    connectedCallback(){
        // Form
        const form = factory.createElement("form");
        this.append(form);

        // Fieldset
        const fieldSet = factory.createElement("fieldset");
        form.append(fieldSet);

        // Legend
        const legend = factory.createElement("legend");
        legend.innerText = this.getAttribute("legend");
        fieldSet.append(legend);

        // Rates
        this.#rateInputs = factory.createElement("rate-inputs");
        fieldSet.append(this.#rateInputs);

        // Simplified Solution
        this.#simpleResult = factory.createElement("simple-result");
        fieldSet.append(this.#simpleResult);
    }

    set calculator(calculator){
        this.#rateInputs.calculator = calculator;
        this.#simpleResult.calculator = calculator;
    }
}

window.customElements.define("parameter-input", ParameterInput);