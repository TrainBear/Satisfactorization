import {RateInput} from "./rateInput.js";
import factory from "../../../../factory.js";
import * as math from "mathjs";

export class RateInputs extends HTMLElement {

    /**
     * @type Array<function>
      */
    #validChangeCallbackFunctions = [];

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

        // Set fields from calculator
        if(!this.#calculator.isValid){
            return;
        }
        const rates = this.#calculator.rates
        rates.forEach(r=>{
            this.#addRateInput(r);
        })
        this.#onChange();
    }

    connectedCallback() {
        // super.connectedCallback();
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
        addButton.addEventListener('click', ()=> {
            this.#addRateInput();
            this.#onChange();
        });
        this.append(label);
        this.append(addButton);
    }

    /**
     *
     * @param startValue {math.Fraction}
     */
    #addRateInput(startValue = undefined){
        const rateInput = factory.createElement("rate-input");
        rateInput.subscribeChange(this.#onChange.bind(this));
        rateInput.subscribeDelete(()=> {
            this.#removeRateInput(rateInput);
            this.#onChange();
        });


        if(startValue === undefined){
            if(this.#rateInputs.length > 0){
                rateInput.rate = this.#rateInputs[this.#rateInputs.length-1].rawValue;
            }else{
                rateInput.rate = math.fraction(0);
            }
        }else{
            rateInput.rate = startValue;
        }

        this.#rateInputs.push(rateInput);
        this.append(rateInput);
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
    }

    #onChange(){
        this.#countInput.valueAsNumber = this.#rateInputs.length;
        const rates = [];
        let error = false;
        for(let i=0; i<this.#rateInputs.length; i++){
            const rateInput = this.#rateInputs[i];
            let rate;
            try{
                rate = rateInput.rate;
            }catch (e){
                this.#calculator.setInvalid("Could not convert '" + rateInput.rawValue + "' to a number/fraction.");
                error = true;
                break;
            }
            rates.push(rate);
        }
        if(error){
            return;
        }
        this.#calculator.rates = rates;
    }

    #onCountSet(){
        const count = math.max(this.#countInput.valueAsNumber, 0);
        while (this.#rateInputs.length > count){
            this.#removeRateInput(this.#rateInputs[this.#rateInputs.length-1]);
        }
        while (this.#rateInputs.length < count){
            this.#addRateInput();
        }
        this.#onChange();
    }
}
window.customElements.define('rate-inputs', RateInputs);