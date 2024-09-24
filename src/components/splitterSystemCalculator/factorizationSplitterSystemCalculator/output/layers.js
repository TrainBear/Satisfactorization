import factory from "../../../../factory";

export class Layers extends HTMLElement {
    /**
     * @type HTMLParagraphElement
     */
    #textElement;
    #initiated = false;
    #calculator;
    #table;
    #tableRows = [];

    set calculator(calculator){
        if(this.#calculator !== undefined){
            this.#calculator.unsubscribeChange(this.#update.bind(this));
        }
        this.#calculator = calculator;
        this.#calculator.subscribeChange(this.#update.bind(this));
        this.#update();
    }

    connectedCallback() {
        // super.connectedCallback();
        if(this.#initiated){
            return;
        }
        this.#initiated = true;

        this.#table = factory.createElement('table');
        this.append(this.#table);

        const caption = factory.createElement('caption');
        caption.innerText = "Layers";
        this.#table.append(caption);

        const tr = factory.createElement('tr');
        this.#table.append(tr);

        const th0 = factory.createElement('th');
        th0.innerText = "#";
        tr.append(th0);

        const th1 = factory.createElement("th");
        th1.innerText = "Division";
        tr.append(th1);

        const th2 = factory.createElement("th");
        th2.innerText = "Rate";
        tr.append(th2);
    }

    #update() {

        if(!this.#calculator.isValid){
            this.#table.remove();
            return;
        }
        this.append(this.#table);

        this.#resetRows();

        const layers = this.#calculator.layers;
        let currentRate = this.#calculator.combinedRate;

        for(let i = 0; i<layers.length; i++){
            const tr = factory.createElement('tr');
            this.#table.append(tr);
            this.#tableRows.push(tr);

            const td0 = factory.createElement('td');
            td0.innerText = (i + 1).toString();
            tr.append(td0);

            const td1 = factory.createElement('td');
            td1.innerText = layers[i].toString();
            tr.append(td1);

            const td2 = factory.createElement('td');
            td2.innerText = currentRate + "/m";
            tr.append(td2);

            currentRate /= layers[i];
        }
    }

    #resetRows() {
        while(this.#tableRows.length > 0){
            this.#tableRows.pop().remove();
        }
    }
}

window.customElements.define("layers-display", Layers);