import factory from "../../../../factory.js";
import * as math from "mathjs";

export class RateInput extends HTMLElement {

    /**
     * @type Array<function>
     */
    #onDeleteCallbackFunctions = [];

    /**
     * @type {Array<function>}
     */
    #onChangeCallbackFunctions = [];

    /**
     * @type HTMLInputElement
     */
    #inputField = factory.createElement("input");

    connectedCallback() {
        // super.connectedCallback();

        const br = factory.createElement("br");
        this.append(br);

        this.#inputField.type = "text";
        this.#inputField.setAttribute("placeholder", "items / minute");
        this.#inputField.setAttribute("name", "rate");
        this.#inputField.addEventListener("change", this.#onChange.bind(this));
        this.append(this.#inputField);

        const deleteButton = factory.createElement('button');
        deleteButton.setAttribute('type', 'button');
        deleteButton.innerText = 'X';
        deleteButton.addEventListener('click', this.#onDelete.bind(this));
        this.append(deleteButton);
    }

    /**
     * Add behaviour for when delete button is pressed.
     * @param callback {function}
     */
    subscribeDelete(callback){
        this.#onDeleteCallbackFunctions.push(callback);
    }

    #onDelete(){
        this.#onDeleteCallbackFunctions.forEach(f=>f());
        this.remove();
    }

    subscribeChange(callback){
        this.#onChangeCallbackFunctions.push(callback);
    }

    #onChange(){
        this.#onChangeCallbackFunctions.forEach(f=>f());
    }

    /**
     *
     * @returns {math.Fraction}
     */
    get rate(){
        if(this.#inputField.value !== ""){
            return math.fraction(this.#inputField.value);
        }else{
            return math.fraction(0);
        }
    }

    /**
     *
     * @param value {math.Fraction}
     */
    set rate(value){
        this.#inputField.value = value.toString();
    }
}

window.customElements.define('rate-input', RateInput);