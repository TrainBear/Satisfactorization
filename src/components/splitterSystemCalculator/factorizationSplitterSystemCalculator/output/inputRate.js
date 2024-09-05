import factory from "../../../../factory.js";

export class InputRate extends HTMLElement {
    /**
     * @type {HTMLParagraphElement}
     */
    #textElement;

    #initiated = false;

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
     *
     * @param calculator
     * @return never
     */
    update(calculator) {
        this.#textElement.innerText = "Input rate: " + calculator.inputRate.toString() + " items / minute";
    }
}

window.customElements.define('input-rate', InputRate);