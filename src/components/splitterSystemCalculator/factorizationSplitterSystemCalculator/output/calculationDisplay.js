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
    connectedCallback(){
        // super.connectedCallback();

        this.#inputRate = factory.createElement("input-rate");
        this.append(this.#inputRate);

        this.#layers = factory.createElement("layers-display");
        this.append(this.#layers);

        this.#outputLayers = factory.createElement("output-layers");
        this.append(this.#outputLayers);

        this.#loopBacks = factory.createElement("loop-backs");
        this.append(this.#loopBacks);
    }

    /**
     *
     * @param calculator {Calculator}
     */
    update(calculator){
        if(!calculator.isValid){
            return;
        }
        this.#inputRate.update(calculator);
        this.#loopBacks.update(calculator);
        this.#layers.update(calculator);
        this.#outputLayers.update(calculator);
    }
}

window.customElements.define('calculation-display', CalculationDisplay);