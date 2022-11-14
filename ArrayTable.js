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


class ArrayTable extends HTMLElement {
    constructor(ds) {
        super();

        this.fnClickTD = undefined;

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

        for (let i = 0; i < this.ds.length; i++) {
            const itemTable = this.ds[i];

            const table = document.createElement('table');
            table.style.border = '1px solid';
            table.style.width = '100%';

            const caption = document.createElement('caption');
            caption.style.fontSize = 'large';
            caption.style.fontWeight = 800;
            caption.style.textAlign = 'left'
            caption.textContent = `TABLE : # ${i}`;
            table.appendChild(caption)

            const tbody = document.createElement('tbody');
            table.appendChild(tbody);
            this.appendChild(table);

            for (let j = 0; j < itemTable.length; j++) {
                const row = itemTable[j];
                const tr = document.createElement('tr');
                tr.style.border = '1px solid';
                tbody.appendChild(tr);

                for (let k = 0; k < row.length; k++) {
                    const col = row[k];
                    const td = document.createElement('td');
                    td.textContent = col;
                    td.style.border = '1px solid';
                    td.style.cursor = 'pointer';
                    td.setAttribute('title', `${j}, ${k}`);
                    td.setAttribute('data-table', i);
                    td.setAttribute('data-row', j);
                    td.setAttribute('data-col', k);

                    td.isSelected = () => {
                        return '' !== td.style.background;
                    }

                    td.addEventListener('click', (e) => {

                        if (td.style.background) {
                            me.checkElement(td, false);
                        } else {
                            me.checkElement(td, true);
                        }

                        if (me.fnClickTD) {
                            me.fnClickTD(e);
                        }
                    });

                    // dblclick to select all rows or cols
                    td.addEventListener('dblclick', (e) => {
                        // td.isSelected
                        const ele = e.target;

                        // const selected = !ele.isSelected();

                        // -- need to fire this click event one more time
                        let needToFire = false;

                        const listToEventDispatch = [];

                        // -- Horizontal
                        if (!e.previousSibling) {
                            let next = ele.nextSibling;

                            while (next) {
                                // this.checkElement(next, selected);
                                //next.dispatchEvent(new CustomEvent('click'));
                                listToEventDispatch.push(next);
                                next = next.nextSibling;
                            }

                            needToFire = true;
                        }

                        // -- Vertical
                        const tr = ele.parentElement;
                        if (!tr.previousSibling) {
                            const idxTd = Array.from(tr.childNodes).findIndex(item => item === ele);

                            let next = tr.nextSibling;

                            // -- find me in parent
                            while (next) {
                                listToEventDispatch.push(next.childNodes[idxTd]);
                                // next.childNodes[idxTd].dispatchEvent(new CustomEvent('click'));
                                next = next.nextSibling;
                            }

                            needToFire = true;
                        }

                        // -- 1
                        if (needToFire) {
                            ele.dispatchEvent(new CustomEvent('click'));
                        }

                        // -- 2 ~ rest
                        if(listToEventDispatch) {
                            listToEventDispatch.forEach(item => item.dispatchEvent(new CustomEvent('click')));
                        }

                    });

                    tr.appendChild(td);
                }
            }

            // -- margin bottom
            table.style.marginBottom = '30px';
        }
    }

    setOnClickTD(fn) {
        this.fnClickTD = fn;
    }

    checkElement(e, check) {
        const color = 'DarkKhaki';
        if (check) {
            e.style.background = color;
        } else {
            e.style.background = '';
        }
    }

    select(table, row, col, check) {
        try {
            const tbody = this.getElementsByTagName('tbody')[table];
            const e = tbody.getElementsByTagName('tr')[row].getElementsByTagName('td')[col];

            this.checkElement(e, check);
        } catch (e) {
            // this can happen
        }
    }

    selectArray(arrayTableRowCol) {
        arrayTableRowCol.forEach(item => {
            const idxTable = item[0];
            const idxRow = item[1];
            const idxCol = item[2];

            this.select(idxTable, idxRow, idxCol, true);
        })
    }
}

customElements.define('array-table', ArrayTable);