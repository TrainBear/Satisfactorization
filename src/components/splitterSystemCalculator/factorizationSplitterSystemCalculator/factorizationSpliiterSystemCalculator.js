import factory from "../../../factory.js";
import './input/rateInputs.js';
import './output/calculationDisplay.js';
import Calculator from "../../../calculator";

export class FactorizationSplitterSystemCalculator extends HTMLElement {
    connectedCallback(){
        // super.connectedCallback();

        const calculator = new Calculator();

        const input = factory.createElement('rate-inputs');
        input.setAttribute("legend", "Parameters")
        this.append(input);
        input.calculator = calculator;

        const output = factory.createElement('calculation-display');
        this.append(output);

        output.calculator = calculator;
    }
}

window.customElements.define("factorization-splitter-system-calculator", FactorizationSplitterSystemCalculator)