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

        const th0 = factory.createElement("th");
        th0.innerText = "Name";
        tr.append(th0);

        const th1 = factory.createElement("th");
        th1.innerText = "Rate";
        tr.append(th1);

        const th2 = factory.createElement("th");
        th2.innerText = "Last Layer Belts";
        tr.append(th2);

        const th3 = factory.createElement("th");
        th3.innerText = "Layer Composition"
        tr.append(th3);

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

        const outputLayers = this.#calculator.outputNumerators;

        for (let i=0; i<outputLayers.length; i++) {
            const name = "output #" + i;
            const data = outputLayers[i];
            this.#addRow(name, data.rate, data.lastLayerBelts, data.layerComposition);
        }
        if(this.#calculator.loopBacks !== 0){
            const lbData = this.#calculator.loopBackData;
            this.#addRow("loop-back", lbData.rate, lbData.lastLayerBelts, lbData.layerComposition);
        }
    }

    #addRow(name, rate, lastLayerBelts, layerComposition){
        const tr = factory.createElement("tr");
        this.#table.append(tr);
        this.#tableRows.push(tr);

        const td0 = factory.createElement('td');
        td0.innerText = name;
        tr.append(td0);

        const td1 = factory.createElement("td");
        td1.innerText = rate + "/m";
        tr.append(td1);

        const td2 = factory.createElement("td");
        td2.innerText = lastLayerBelts;
        tr.append(td2);

        const td3 = factory.createElement('td');
        td3.innerText = layerComposition;
        tr.append(td3);
    }

    #resetRows(){
        while(this.#tableRows.length > 0){
            this.#tableRows.pop().remove();
        }
    }
}
window.customElements.define('output-layers', OutputLayers);