import factory from "../../../../factory.js";

class OutputLayers extends HTMLElement{
    #textElement;
    connectedCallback(){
        this.#textElement = factory.createElement("p");
        this.append(this.#textElement);
    }

    /**
     *
     * @param calculator {Calculator}
     */
    update(calculator){
        if(!calculator.isValid){
            return;
        }
        const outputLayers = calculator.outputLayers;
        let s = "Output belts: ";
        for (let i=0; i<outputLayers.length; i++) {
            s += outputLayers[i].rate.toString() + ": " + outputLayers[i].belts.toString() + " | ";
        }
        s = s.slice(0, s.length - " | ".length);
        this.#textElement.innerText = s;
    }
}
window.customElements.define('output-layers', OutputLayers);