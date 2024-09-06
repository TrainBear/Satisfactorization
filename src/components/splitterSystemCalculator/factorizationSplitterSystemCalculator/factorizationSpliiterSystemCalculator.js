import factory from "../../../factory.js";
import './input/rateInputs.js';
import './output/calculationDisplay.js';
import Calculator from "../../../calculator";

export class FactorizationSplitterSystemCalculator extends HTMLElement {
    connectedCallback(){
        // super.connectedCallback();

        const calculator = new Calculator();

        const output = factory.createElement('calculation-display');

        const input = factory.createElement('rate-inputs');
        input.setAttribute("legend", "Parameters")
        input.subscribeChange(()=>{
            output.update(input.calculator)
        });
        input.calculator = calculator;


        this.append(input);
        this.append(output);
    }
}

window.customElements.define("factorization-splitter-system-calculator", FactorizationSplitterSystemCalculator)