import factory from "../../../../factory";

export default class SimpleResult extends HTMLElement{
    #calculator;
    #checkbox;
    set calculator(calculator){
        this.#calculator = calculator;
        this.#checkbox.checked = calculator.simpleResult;
    }

    connectedCallback(){
        const br = factory.createElement("br");
        this.append(br);

        const label = factory.createElement("label");
        label.innerText = "Simple Result";
        label.setAttribute("title", "Only let the last layer to be three.");
        this.append(label);

        this.#checkbox = factory.createElement("input");
        this.#checkbox.setAttribute("type", "checkbox");
        this.#checkbox.addEventListener("change", e =>{
            this.#calculator.simpleResult = e.target.checked;
        });
        this.append(this.#checkbox);
    }
}

window.customElements.define("simple-result", SimpleResult);