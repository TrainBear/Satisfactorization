import factory from "../../../../factory.js";

export class InputRate extends HTMLElement {
    /**
     * @type {HTMLParagraphElement}
     */
    #textElement;

    #initiated = false;
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
        // super.connectedCallback();
        if(this.#initiated){
            return;
        }
        this.#initiated = true;
        this.#textElement = factory.createElement('p');
        this.append(this.#textElement);
    }

    /**
     * @return never
     */
    #update() {
        if(this.#calculator.isValid){
            this.append(this.#textElement);
            this.#textElement.innerText = "Input rate: " + this.#calculator.inputRate.toString() + " items / minute";
        }else{
            this.#textElement.remove();
        }
    }
}

window.customElements.define('input-rate', InputRate);