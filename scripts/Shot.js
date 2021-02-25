class Shot {
    constructor(parent, name) {
        // console.dir(parent);
        this.id = name;
        this.parent = parent;
        this.direction = parent.direction.substr(5);
        this.position = this._getPosition();
        this._render();
        this.lastPosition = this.position;
        this.key = setInterval(this._cycle.bind(this), 1000 / this.parent.speed);
    }
    /**
     * Функция, являясь циклом жизни снаряда (запущена в интервале this.speed),
     * перемещает снаряд методом this._move, проверяет корректность новой позиции
     * и отрисовывает снаряд в новой позиции; если позиция некорректна,
     * прерывает цикл жизни снаряда
     */
    _cycle() {
        let status = true;
        this._move();
        this.position ? this._render() : status = false;
        if (!status) {
            clearInterval(this.key);
            delete this.parent.shots[this.id];
        }
    }
    /**
     * Функция сохраняет в this.lastPosition текущую позицию,
     * изменяет позицию (this.position) снаряда на следующую и
     * удаляет ее отображение методом this._remove
     */
    _move() {
        this.lastPosition ? this._remove() : null;
        let nextPosition = this._getNextPosition(...this.position)
        this._isPositionCorrect(nextPosition) ? this.position = nextPosition : this.position = null;
        this.position ? this.lastPosition = [...this.position] : this.lastPosition = null;
    }
    /**
     * Функция отрисовывает снаряд на поле
     */
    _render() {
        let cellEl = document.querySelector(`.field_cell[data-x="${this.position[0]}"][data-y="${this.position[1]}"]`);
        !cellEl.classList.contains('shot') ? cellEl.classList.add('shot') : null;
    }
    /**
     * Функция удаляет снаряд с поля
     */
    _remove() {
        let cellEl = document.querySelector(`.field_cell[data-x="${this.lastPosition[0]}"][data-y="${this.lastPosition[1]}"]`);
        cellEl.classList.contains('shot') ? cellEl.classList.remove('shot') : null;
    }
    /**
     * Функция определяет начальную позицию снаряда
     * @param {Object} parent - объект игрока, совершившего выстрел
     * @returns {Array} - массив координат снаряда или null,
     * если игрок нацелен вплотную на препятствие
     */
    _getPosition() {
        let position = null;
        let gun = null;
        switch (this.direction) {
            case 'Up':
                gun = [...this.parent.body[1]];
                break;
            case 'Down':
                gun = [...this.parent.body[7]];
                break;
            case 'Left':
                gun = [...this.parent.body[3]];
                break;
            case 'Right':
                gun = [...this.parent.body[5]];
                break;
        }
        let nextPosition = this._getNextPosition(...gun);
        this._isPositionCorrect(nextPosition) ? position = [...nextPosition] : null;
        return position;
    }
    /**
     * Функция проверяет: доступны ли координаты
     * для отрисовки по ним снаряда
     * @param {Array} position - массив координат
     * @returns {Boolean}
     */
    _isPositionCorrect(position) {
        let x = position[0];
        let y = position[1];
        return x <= field.columns && x > 0 && y <= field.rows && y > 0;
    }
    /**
     * Функция определяет координаты следующей позиции снаряда
     * @param {*} currentX - координата Х
     * @param {*} currentY - координата У
     * @returns {Array} - массив координат позиции
     */
    _getNextPosition(currentX, currentY) {
        switch (this.direction) {
            case 'Up':
                currentY--;
                break;
            case 'Down':
                currentY++;
                break;
            case 'Left':
                currentX--;
                break;
            case 'Right':
                currentX++;
                break;
        }
        return [currentX, currentY];
    }
}