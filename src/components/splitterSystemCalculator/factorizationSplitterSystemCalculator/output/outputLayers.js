import factory from "../../../../factory.js";

class OutputLayers extends HTMLElement{
    #table;
    #tableRows = [];
    #initiated;
    #calculator;

    set calculator(calculator){
        if(this.#calculator !== undefined){
            this.#calculator.unsubscribeChange(this.#update.bind(this));
        }
        this.#calculator = calculator;
        this.#calculator.subscribeChange(this.#update.bind(this));
        this.#update();
    }

    connectedCallback(){
        if(this.#initiated){
            return;
        }
        this.#initiated = true;
        this.#table = factory.createElement("table");
        this.#table.setAttribute("title", "This table describes how many last layer belts must be " +
            "merged to get the requested outputs.");

        const caption = factory.createElement("caption");
        caption.innerText = 'Output Merging'
        this.#table.append(caption);

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
     */
    #update(){
        this.#resetRows();

        if(!this.#calculator.isValid){
            this.#table.remove();
            return;
        }
        this.append(this.#table);

        const outputLayers = this.#calculator.outputLayers;

        for (let i=0; i<outputLayers.length; i++) {
            const tr = factory.createElement("tr");
            this.#table.append(tr);
            this.#tableRows.push(tr);

            const td1 = factory.createElement("td");
            td1.innerText = outputLayers[i].rate;
            tr.append(td1);

            const td2 = factory.createElement("td");
            td2.innerText = outputLayers[i].belts;
            tr.append(td2);
        }
    }

    #resetRows(){
        while(this.#tableRows.length > 0){
            this.#tableRows.pop().remove();
        }
    }
}
window.customElements.define('output-layers', OutputLayers);