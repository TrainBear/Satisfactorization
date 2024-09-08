import factory from "../../../../factory";

class StatusDisplay extends HTMLElement {
    /**
     * @type boolean
     */
    #initiated;
    /**
     * @type HTMLParagraphElement
     */
    #textElement;
    /**
     * @type Calculator
     */
    #calculator;

    set calculator(calculator){
        if(this.#calculator !== undefined){
            this.#calculator.unsubscribeChange(this.#update.bind(this));
        }
        this.#calculator = calculator;
        this.#calculator.subscribeChange(this.#update.bind(this));
        this.#update();
        this.append(this.#textElement);
    }

    connectedCallback(){
        if(this.#initiated){
            return;
        }
        this.#initiated = true;
        this.#textElement = factory.createElement('p');
        this.#textElement.innerText = "Please enter parameters.";
    }

    #update(){
         this.#textElement.innerText = this.#calculator.statusMessage;

    }
}

window.customElements.define('status-display', StatusDisplay);