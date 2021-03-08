class Field {
    constructor(columns = 50, rows = columns, playersCount = 1) {
        this.columns = columns;
        this.rows = rows;
        this.players = { count: 0 };
        this._render();
        this._createPlayers(playersCount);
    }
    /**
     * функция вставляет HTML разметку в контейнер
     * @param {String} wrapper контейнер
     */
    _render(wrapper = '.main') {
        document.querySelector(wrapper).insertAdjacentHTML("afterbegin", this._generateTemplate())
    }
    /**
     * функция генерирует HTML разметку
     * @returns {String} разметка
     */
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
    /**
     * функция вызывает конструктор класса игрока count раз
     * @param {Number} count - количество игроков (1-4) 
     */
    _createPlayers(count) {
        count > 4 ? count = 4 : null;
        for (let counter = 0; counter < count; counter++) {
            this.players[String(counter)] = new Player(String(counter), this);
            this.players.count++;
        }
    }
}