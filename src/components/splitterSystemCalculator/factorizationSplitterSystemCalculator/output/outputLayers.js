import factory from "../../../../factory.js";

class OutputLayers extends HTMLElement{
    #table;
    #tableRows = [];
    connectedCallback(){
        this.#table = factory.createElement("table");

        const tr = factory.createElement("tr");
        this.#table.append(tr);

        const th1 = factory.createElement("th");
        th1.innerText = "Output rate";
        tr.append(th1);

        const th2 = factory.createElement("th");
        th2.innerText = "Last Layer Belts";
        tr.append(th2);

        this.append(this.#table);
    }

    /**
     *
     * @param calculator {Calculator}
     */
    update(calculator){
        this.#resetRows();

        const outputLayers = calculator.outputLayers;

        for (let i=0; i<outputLayers.length; i++) {
            const tr = factory.createElement("tr");
            this.#table.append(tr);

            const td1 = factory.createElement("td");
            td1.innerText = outputLayers[i].rate;
            tr.append(td1);
            this.#tableRows.push(td1);

            const td2 = factory.createElement("td");
            td2.innerText = outputLayers[i].belts;
            tr.append(td2);
            this.#tableRows.push(td2);
        }
    }

    #resetRows(){
        while(this.#tableRows.length > 0){
            this.#tableRows.pop().remove();
        }
    }
}
window.customElements.define('output-layers', OutputLayers);