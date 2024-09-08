import factory from "../../../../factory";

export class Layers extends HTMLElement {
    /**
     * @type HTMLParagraphElement
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
        this.#textElement = factory.createElement("p");
        this.#textElement.setAttribute("title", "A list of twos and threes. Start with one belt(input). For every layer(number:x), split every belt from the previous layer with a x-way splitter.");
    }

    #update() {

        if(this.#calculator.isValid){
            this.append(this.#textElement);
            this.#textElement.innerText = "Layers: " + this.#calculator.layers.toString();
        }else{
            this.#textElement.remove();
        }
    }
}

window.customElements.define("layers-display", Layers);