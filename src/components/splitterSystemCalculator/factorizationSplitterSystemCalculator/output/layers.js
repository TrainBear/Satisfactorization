import factory from "../../../../factory";
import {isUndefined} from "mathjs";

export class Layers extends HTMLElement {
    /**
     * @type HTMLParagraphElement
     */
    #textElement;
    connectedCallback() {
        // super.connectedCallback();
        this.#textElement = factory.createElement("p");
        this.append(this.#textElement);
    }

    update(calculator) {
        if(isUndefined(calculator.layers)){
            return;
        }
        this.#textElement.innerText = "Layers: " + calculator.layers.toString();
    }
}

window.customElements.define("layers-display", Layers);