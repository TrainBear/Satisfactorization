import {RateInput} from "./rateInput.js";
import factory from "../../../../factory.js";
import * as math from "mathjs";

export class RateInputs extends HTMLElement {

    /**
     * @type Array<function>
      */
    #validChangeCallbackFunctions = [];

    /**
     * @type HTMLFieldSetElement
     */
    #fieldSet;

    /**
     * @type Array<RateInput>
     */
    #rateInputs = [];

    /**
     * @type HTMLInputElement
     */
    #countInput;

    /**
     * @type Calculator
     */
    #calculator;

    /**
     *
     * @returns {Calculator}
     */
    get calculator(){
        return this.#calculator;
    }

    /**
     *
     * @param calculator {Calculator}
     */
    set calculator(calculator){
        this.#calculator = calculator;
    }

    connectedCallback() {
        // super.connectedCallback();
        // Legend
        const legend = factory.createElement("legend");
        legend.innerText = this.getAttribute("legend");

        // Count
        const label = factory.createElement("label");
        label.innerText = "Output belt count";
        this.#countInput = factory.createElement("input");
        this.#countInput.setAttribute("type", "number");
        this.#countInput.setAttribute("placeholder", "output count");
        this.#countInput.valueAsNumber = this.#rateInputs.length;
        this.#countInput.addEventListener("change", this.#onCountSet.bind(this));
        label.append(this.#countInput);

        // Increment button
        const addButton = factory.createElement("button");
        addButton.setAttribute("type", "button");
        addButton.innerText = "Increment";
        addButton.addEventListener('click', this.#addRateInput.bind(this));

        // Fieldset
        this.#fieldSet = factory.createElement("fieldset");
        this.#fieldSet.append(legend);
        this.#fieldSet.append(label);
        this.#fieldSet.append(addButton);

        // Form
        const form = factory.createElement("form");
        form.append(this.#fieldSet);
        this.append(form);
    }

    #addRateInput(){
        const rateInput = factory.createElement("rate-input");
        rateInput.subscribeChange(this.#onChange.bind(this));
        rateInput.subscribeDelete(()=>this.#removeRateInput(rateInput));
        if(this.#rateInputs.length > 0){
            rateInput.rate = this.#rateInputs[this.#rateInputs.length-1].rate;
        }else{
            rateInput.rate = math.fraction(0);
        }

        this.#rateInputs.push(rateInput);
        this.#fieldSet.append(rateInput);
        this.#onChange();
    }

    /**
     *
     * @param rateInput {RateInput}
     */
    #removeRateInput(rateInput){
        const index = this.#rateInputs.indexOf(rateInput);
        this.#rateInputs.splice(index, 1);
        if(document.contains(rateInput)){
            rateInput.remove();
        }
        this.#onChange();
    }

    /**
     * Add behaviour for when a valid change has happened
     * @param callback function
     */
    subscribeChange(callback){
        this.#validChangeCallbackFunctions.push(callback);
    }

    #onChange(){
        this.#countInput.valueAsNumber = this.#rateInputs.length;
        this.#calculator.rates = this.#rateInputs.map(e=>e.rate);
        this.#validChangeCallbackFunctions.forEach(f=>f());
    }

    #onCountSet(){
        const count = math.max(this.#countInput.valueAsNumber, 0);
        while (this.#rateInputs.length > count){
            this.#removeRateInput(this.#rateInputs[this.#rateInputs.length-1]);
        }
        while (this.#rateInputs.length < count){
            this.#addRateInput();
        }
    }
}
window.customElements.define('rate-inputs', RateInputs);