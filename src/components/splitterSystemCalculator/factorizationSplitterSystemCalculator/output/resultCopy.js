class ResultCopy extends HTMLElement{
    #calculator;

    set calculator(calculator){
        this.#calculator = calculator;
    }

    connectedCallback(){
        const button = document.createElement("button");
        button.innerText = "Compact Copy";
        button.setAttribute("type", "button");
        button.addEventListener("click", () => {
            this.#copy();
        })
        this.append(button);
    }

    #copy(){
        const content = this.#createContent();
        // navigator.clipboard.writeText(content.toString());
        // const item = new ClipboardItem({
        //     [content.type]: content
        // });
        // navigator.clipboard.write([item]);

        const blob = new Blob([content], { type: "text/plain" });
        navigator.clipboard.write([
            new ClipboardItem({
                [blob.type]: blob,
            }),
        ]);
    }


    #createContent() {
        if(this.#calculator.isValid === false){
            return this.#calculator.statusMessage;
        }

        let content = "";
        const rates = this.#calculator.rates;
        const layers = this.#calculator.layers;
        const numerators = this.#calculator.outputNumerators;
        const lb = this.#calculator.loopBackData;
        content += "Layers: " + layers.toString() + "\n";
        for (let i = 0; i < numerators.length; i++){
            content += "#" + (i+1).toString() + "(" + rates[i].toString() + "/m): "
                + numerators[i].layerComposition.toString() + "\n";
        }
        if(this.#calculator.loopBacks !== 0){
            content += "lb(" + lb.rate.toString() + "/m): " + lb.layerComposition.toString();
        }

        return content;
    }
}

window.customElements.define('result-copy',ResultCopy);