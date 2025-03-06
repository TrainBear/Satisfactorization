import factory from "../../../../factory";

export default class SimpleResult extends HTMLElement{
    #calculator;
    #simpleCheckbox;
    set calculator(calculator){
        this.#calculator = calculator;
        this.#simpleCheckbox.checked = calculator.simpleSolution;
    }

    connectedCallback(){
        const br = factory.createElement("br");
        this.append(br);
        this.#createSimple();
    }

    #createSimple() {

        const label = factory.createElement("label");
        label.innerText = "One splitter line";
        label.setAttribute("title", "Only allow solutions with one single splitter line.");
        this.append(label);

        this.#simpleCheckbox = factory.createElement("input");
        this.#simpleCheckbox.setAttribute("type", "checkbox");
        this.#simpleCheckbox.addEventListener("change", e =>{
            this.#calculator.simpleSolution = e.target.checked;
        });
        label.append(this.#simpleCheckbox);
    }
}

window.customElements.define("simple-result", SimpleResult);