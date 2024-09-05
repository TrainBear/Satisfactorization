import factory from "../../../../factory.js";

export class LoopBacks extends HTMLElement {
    /**
     * @type {HTMLParagraphElement}
     */
    #textElement;
    #initiated;

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
     *
     * @param calculator {Calculator}
     * @return never
     */
    update(calculator) {
        this.#textElement.innerText = "loop-backs: " + calculator.loopBacks.toString() + " belts";
    }
}

window.customElements.define('loop-backs', LoopBacks);