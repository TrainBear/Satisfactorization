import factory from "../../../../factory.js";
import './inputRate.js';
import './layers.js';
import './outputLayers.js';
import './statusDisplay.js';
import './resultCopy.js';

export class CalculationDisplay extends HTMLElement{

    #inputRate;
    #layers;
    #loopBacks;
    #outputLayers;
    #statusMessage;
    #resultCopy;
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

        this.#resultCopy = factory.createElement("result-copy");
        this.append(this.#resultCopy);
    }

    set calculator(calculator){
        this.#statusMessage.calculator = calculator;
        this.#inputRate.calculator = calculator;
        this.#layers.calculator = calculator;
        this.#outputLayers.calculator = calculator;
        this.#resultCopy.calculator = calculator;
    }
}

window.customElements.define('calculation-display', CalculationDisplay);
