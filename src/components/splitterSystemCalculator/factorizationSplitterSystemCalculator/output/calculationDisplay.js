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
    connectedCallback(){
        // super.connectedCallback();

        this.#statusMessage = factory.createElement('status-display');
        this.append(this.#statusMessage);

        this.#inputRate = factory.createElement("input-rate");
        this.append(this.#inputRate);

        this.#layers = factory.createElement("layers-display");
        this.append(this.#layers);

        this.#outputLayers = factory.createElement("output-layers");
        this.append(this.#outputLayers);

        this.#loopBacks = factory.createElement("loop-backs");
        this.append(this.#loopBacks);
    }

    set calculator(calculator){
        this.#statusMessage.calculator = calculator;
        this.#inputRate.calculator = calculator;
        this.#layers.calculator = calculator;
        this.#outputLayers.calculator = calculator;
        this.#loopBacks.calculator = calculator;
    }
}

window.customElements.define('calculation-display', CalculationDisplay);