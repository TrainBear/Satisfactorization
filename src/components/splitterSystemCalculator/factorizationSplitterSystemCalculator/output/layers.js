import factory from "../../../../factory";

export class Layers extends HTMLElement {
    /**
     * @type HTMLParagraphElement
     */
    #textElement;
    #initiated = false;
    connectedCallback() {
        // super.connectedCallback();
        if(this.#initiated){
            return;
        }
        this.#initiated = true;
        this.#textElement = factory.createElement("p");
        this.#textElement.setAttribute("title", "A list of twos and threes. Start with one belt(input). For every layer(number:x), split every belt from the previous layer with a x-way splitter.");
        this.append(this.#textElement);
    }

    update(calculator) {
        this.#textElement.innerText = "Layers: " + calculator.layers.toString();
    }
}

window.customElements.define("layers-display", Layers);