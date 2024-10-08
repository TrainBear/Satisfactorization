import factory from "../../../../factory.js";
import './inputRate.js';
import './layers.js';
import './outputLayers.js';
import './statusDisplay.js';
import './resultCopy.js';
import './mixedRate.js';
import  './propagation.js'

export class CalculationDisplay extends HTMLElement{

    #inputRate;
    #layers;
    #outputLayers;
    #statusMessage;
    #resultCopy;
    #shownOnValid;
    #mixedRate;
    #propagation;

    connectedCallback(){
        this.#statusMessage = factory.createElement('status-display');
        this.append(this.#statusMessage);

        this.#shownOnValid = factory.createElement('div');
        this.append(this.#shownOnValid);

        this.#inputRate = factory.createElement("input-rate");
        this.#shownOnValid.append(this.#inputRate);

        this.#mixedRate = factory.createElement('mixed-rate');
        this.#shownOnValid.append(this.#mixedRate);

        this.#propagation = factory.createElement('propagation-rounds');
        this.#shownOnValid.append(this.#propagation);

        this.#layers = factory.createElement("layers-display");
        this.#shownOnValid.append(this.#layers);

        this.#outputLayers = factory.createElement("output-layers");
        this.#shownOnValid.append(this.#outputLayers);

        this.#resultCopy = factory.createElement("result-copy");
        this.#shownOnValid.append(this.#resultCopy);
    }

    set calculator(calculator){
        this.#shownOnValid.hidden = !calculator.isValid;
        calculator.subscribeChange(()=>{
            this.#shownOnValid.hidden = !calculator.isValid;
        });

        this.#statusMessage.calculator = calculator;
        this.#inputRate.calculator = calculator;
        this.#mixedRate.calculator = calculator;
        this.#propagation.calculator = calculator;
        this.#layers.calculator = calculator;
        this.#outputLayers.calculator = calculator;
        this.#resultCopy.calculator = calculator;
    }
}

window.customElements.define('calculation-display', CalculationDisplay);
