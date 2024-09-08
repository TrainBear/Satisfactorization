import factory from "../../../../factory.js";

export class LoopBacks extends HTMLElement {
    /**
     * @type {HTMLParagraphElement}
     */
    #textElement;
    #initiated;
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
        this.#textElement.setAttribute("title", "The number of last layer belts that must be merged with the input.");
        this.append(this.#textElement);
    }

    /**
     * @return never
     */
    #update() {
        if(this.#calculator.isValid){
            this.append(this.#textElement);
            this.#textElement.innerText = "loop-backs: " + this.#calculator.loopBacks.toString() + " belts";
        }else{
            this.#textElement.remove();
        }
    }
}

window.customElements.define('loop-backs', LoopBacks);