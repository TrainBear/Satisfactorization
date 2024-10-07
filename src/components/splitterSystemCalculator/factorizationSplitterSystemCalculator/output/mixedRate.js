import factory from "../../../../factory";

class MixedRate extends HTMLElement{

    #textElement;
    #calculator;

    connectedCallback(){
        this.#textElement = factory.createElement('p');
        this.append(this.#textElement);
    }

    set calculator(calculator){
        this.#calculator = calculator;
        calculator.subscribeChange(this.#update.bind(this));
    }

    #update(){
        if(!this.#calculator.isValid){
            return;
        }
        this.#textElement.innerText = "Mixed rate:" + this.#calculator.mixedRate + "/m";
    }
}

window.customElements.define('mixed-rate', MixedRate);