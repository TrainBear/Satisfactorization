import factory from "../../../../factory.js";

export class InputRate extends HTMLElement{
    /**
     * @type {HTMLParagraphElement}
     */
    #textElement;
    #calculator;

    set calculator(calculator){
        if(this.#calculator !== undefined){
            this.#calculator.unsubscribeChange(this.#update.bind(this));
        }
        this.#calculator = calculator;
        this.#calculator.subscribeChange(this.#update.bind(this));
        this.#update();
    }

    connectedCallback() {
        this.#textElement = factory.createElement('p');
        this.append(this.#textElement);
    }

    /**
     * @return never
     */
    #update() {
        if(this.#calculator.isValid){
            this.#textElement.innerText = "Input rate: " + this.#calculator.inputRate.toString() + "/m";
        }
    }
}

window.customElements.define('input-rate', InputRate);