class ArrayTableResult extends HTMLElement {
    constructor(ds) {
        super();

        if (ds) {
            this.setDataSource(ds);
        }
    }

    setDataSource(ds) {
        this.ds = ds;
        this.refreshChild();
    }

    getDataSource() {
        return this.ds;
    }

    refreshChild() {
        const me = this;
        this.innerHTML = ''; // -- clear

        const table = document.createElement('table');
        table.style.border = '1px solid';
        table.style.width = '100%';
        this.appendChild(table);

        const tbody = document.createElement('tbody');
        table.appendChild(tbody);

        for (let i = 0; i < this.ds.length; i++) {
            const row = this.ds[i];
            const tr = document.createElement('tr');
            tr.style.border = '1px solid';
            tbody.appendChild(tr);

            for (let j = 0; j < row.length; j++) {
                const col = row[j];
                const td = document.createElement('td');
                td.style.border = '1px solid';
                td.textContent = this.ds[i][j];
                tr.appendChild(td);
            }
        }
    }
}

customElements.define('array-table-result', ArrayTableResult);