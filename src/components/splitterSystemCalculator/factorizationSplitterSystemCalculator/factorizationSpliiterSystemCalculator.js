import factory from "../../../factory.js";
import './input/parameterInput.js';
import './output/calculationDisplay.js';
import Calculator from "../../../calculator";
import UrlParamsManager from "../../../urlParamsManager.js";

export class FactorizationSplitterSystemCalculator extends HTMLElement {
    connectedCallback(){
        // super.connectedCallback();

        const calculator = new Calculator();

        const urlManager = new UrlParamsManager(calculator);

        const input = factory.createElement('parameter-input');
        input.setAttribute("legend", "Parameters")
        this.append(input);
        input.calculator = calculator;

        const output = factory.createElement('calculation-display');
        this.append(output);
        output.calculator = calculator;
    }
}

window.customElements.define("factorization-splitter-system-calculator", FactorizationSplitterSystemCalculator)