import factory from "../../../../factory";

class StatusDisplay extends HTMLElement {
    #initiated;
    #textElement;
    connectedCallback(){
        if(this.#initiated){
            return;
        }
        this.#initiated = true;
        this.#textElement = factory.createElement('p');
        this.#textElement.innerText = "Please enter parameters.";
        this.append(this.#textElement);
    }

    update(calculator){
        this.#textElement.innerText = calculator.statusMessage;
    }
}

window.customElements.define('status-display', StatusDisplay);