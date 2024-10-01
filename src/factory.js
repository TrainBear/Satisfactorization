export default class {

    /**
     * Create HTML element.
     * @param tagName
     * @returns {HTMLInputElement|HTMLParagraphElement|HTMLFieldSetElement|RateInput|RateInputs|HTMLLegendElement|
     * CalculationDisplay|InputRate|HTMLParagraphElement|HTMLDivElement}
     */
    static createElement(tagName){
        switch (tagName) {
            case 'input':
                return this.#createInput();
            default:
                return document.createElement(tagName);
        }
    }

    static #createInput(){
        const element = document.createElement("input");
        element.addEventListener("focus", ()=>{
            element.select();
        });
        return element;
    }
}