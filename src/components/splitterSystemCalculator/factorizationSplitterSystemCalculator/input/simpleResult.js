import factory from "../../../../factory";

export default class SimpleResult extends HTMLElement{
    #calculator;
    #noDoubleCheckbox;
    set calculator(calculator){
        this.#calculator = calculator;
        this.#noDoubleCheckbox.checked = calculator.noDouble;
    }

    connectedCallback(){
        const br = factory.createElement("br");
        this.append(br);
        this.#createNoDouble();
    }

    #createNoDouble() {

        const label = factory.createElement("label");
        label.innerText = "No double";
        label.setAttribute("title", "Only let the last layer to be three.");
        this.append(label);

        this.#noDoubleCheckbox = factory.createElement("input");
        this.#noDoubleCheckbox.setAttribute("type", "checkbox");
        this.#noDoubleCheckbox.addEventListener("change", e =>{
            this.#calculator.noDouble = e.target.checked;
        });
        this.append(this.#noDoubleCheckbox);
    }
}

window.customElements.define("simple-result", SimpleResult);