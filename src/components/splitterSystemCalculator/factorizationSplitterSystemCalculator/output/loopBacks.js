import factory from "../../../../factory.js";

export class LoopBacks extends HTMLElement {
    /**
     * @type {HTMLParagraphElement}
     */
    #textElement;

    connectedCallback() {
        // super.connectedCallback();
        this.#textElement = factory.createElement('p');
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