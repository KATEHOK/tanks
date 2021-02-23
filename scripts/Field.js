class Field {
    constructor(columns = 50, rows = columns) {
        this.columns = columns;
        this.rows = rows;
        this._render()
    }
    _render(wrapper = '.main') {
        document.querySelector(wrapper).insertAdjacentHTML("afterbegin", this._generateTemplate())
    }
    _generateTemplate() {
        let template = '<table class="earth"><tbody class="field">';
        for (let y = 1; y <= this.rows; y++) {
            template += '<tr>';
            for (let x = 1; x <= this.columns; x++) {
                template += `<td class="field_cell" data-x="${x}" data-y="${y}"></td>`;
            }
            template += '</tr>';
        }
        template += '</tbody></table>';
        return template;
    }
}