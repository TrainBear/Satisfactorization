import factory from "../../../../factory.js";
import './inputRate.js'
import './loopBacks.js'
import './layers.js'
import './outputLayers.js'
import './statusDisplay.js'

export class CalculationDisplay extends HTMLElement{

    #inputRate;
    #layers;
    #loopBacks;
    #outputLayers;
    #statusMessage;
    #div;
    connectedCallback(){
        // super.connectedCallback();

        this.#statusMessage = factory.createElement('status-display');
        this.append(this.#statusMessage);

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
        this.#statusMessage.update(calculator);

        if(!calculator.isValid){
            this.#div.remove();
            return;
        }
        this.append(this.#div);

        this.#inputRate.update(calculator);
        this.#loopBacks.update(calculator);
        this.#layers.update(calculator);
        this.#outputLayers.update(calculator);
    }
}

window.customElements.define('calculation-display', CalculationDisplay);