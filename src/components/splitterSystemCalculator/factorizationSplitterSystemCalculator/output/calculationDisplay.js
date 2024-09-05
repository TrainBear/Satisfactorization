import factory from "../../../../factory.js";
import './inputRate.js'
import './loopBacks.js'
import './layers.js'
import './outputLayers.js'

export class CalculationDisplay extends HTMLElement{

    #inputRate;
    #layers;
    #loopBacks;
    #outputLayers;
    #invalidInputMessage;
    #div;
    connectedCallback(){
        // super.connectedCallback();

        this.#invalidInputMessage = factory.createElement('p');
        this.#invalidInputMessage.innerText = "Invalid parameters!";
        this.append(this.#invalidInputMessage);

        this.#div = factory.createElement('div');

        this.#inputRate = factory.createElement("input-rate");
        this.#div.append(this.#inputRate);

        this.#layers = factory.createElement("layers-display");
        this.#div.append(this.#layers);

        this.#outputLayers = factory.createElement("output-layers");
        this.#div.append(this.#outputLayers);

        this.#loopBacks = factory.createElement("loop-backs");
        this.#div.append(this.#loopBacks);
    }

    /**
     *
     * @param calculator {Calculator}
     */
    update(calculator){
        if(!calculator.isValid){
            this.#div.remove();
            this.append(this.#invalidInputMessage);
            return;
        }
        this.#invalidInputMessage.remove();
        this.append(this.#div);

        this.#inputRate.update(calculator);
        this.#loopBacks.update(calculator);
        this.#layers.update(calculator);
        this.#outputLayers.update(calculator);
    }
}

window.customElements.define('calculation-display', CalculationDisplay);