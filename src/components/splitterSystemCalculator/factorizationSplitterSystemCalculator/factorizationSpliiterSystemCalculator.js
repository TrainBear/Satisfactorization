import factory from "../../../factory.js";
import './input/rateInputs.js';
import './output/calculationDisplay.js';

export class FactorizationSplitterSystemCalculator extends HTMLElement {
    connectedCallback(){
        // super.connectedCallback();

        const output = factory.createElement('calculation-display');

        const input = factory.createElement('rate-inputs');
        input.setAttribute("legend", "Parameters")
        input.subscribeChange(()=>{
            output.update(input.calculator)
        });


        this.append(input);
        this.append(output);
    }
}

window.customElements.define("factorization-splitter-system-calculator", FactorizationSplitterSystemCalculator)