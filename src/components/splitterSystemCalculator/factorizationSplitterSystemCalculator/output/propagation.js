import factory from "../../../../factory";

class Propagation extends HTMLElement{
    #textElement;
    #calculator;
    connectedCallback(){
        this.#textElement = factory.createElement('p');
        this.append(this.#textElement);
    }

    set calculator(calculator){
        this.#calculator = calculator;
        calculator.subscribeChange(this.#update.bind(this));
        this.#update();
    }

    #update(){
        if(!this.#calculator.isValid){
            return;
        }

        const percentage = 99.99;
        const time = this.#calculator.propagationRounds(percentage);
        this.#textElement.innerText = percentage + '% propagation: ' + time + " rounds";
    }
}

window.customElements.define('propagation-rounds', Propagation);