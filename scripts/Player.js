class Player {
    constructor(index, parent, limit = 5, speed = 60) {
        this.id = index;
        this.parent = parent;
        this.limit = limit;
        this.speed = speed;
        this.time = new Date().getTime();
        this._calcPseudoCoordsAndDirection();
        this.body = this._getBody();
        this.shots = { count: 0 };
        this._render();
        this._addKeydownEventListener();
    }
    /**
     * функция по индексу игрока расчитывает псевдо-координаты и направление игрока
     */
    _calcPseudoCoordsAndDirection() {
        switch (this.id) {
            case '0':
                this.pseudoX = 1;
                this.pseudoY = 1;
                this.direction = 'ArrowRight';
                break;
            case '1':
                console.dir(this);
                this.pseudoX = this.parent.columns - 2;
                this.pseudoY = 1;
                this.direction = 'ArrowLeft';
                break;
            case '2':
                console.dir(this);
                this.pseudoX = 1;
                this.pseudoY = this.parent.rows - 2;
                this.direction = 'ArrowRight';
                break;
            case '3':
                console.dir(this);
                this.pseudoX = this.parent.columns - 2;
                this.pseudoY = this.parent.rows - 2;
                this.direction = 'ArrowLeft';
                break;
        }
    }
    /**
     * Функция отображает на поле корректное положение игрока
     */
    _render() {
        this.body.forEach((cell) => {
            let cellEl = document.querySelector(`.field_cell[data-x="${cell[0]}"][data-y="${cell[1]}"]`);
            !cellEl.classList.contains('player') ? cellEl.classList.add('player') : null;
        });
        this._renderDirection();
    }
    /**
     * Функция устанавливает обработчик нажатия клавиш для каждого игрока
     */
    _addKeydownEventListener() {
        window.addEventListener('keydown', event => {
            let code = event.code;
            const valuies = ['KeyW', 'KeyS', 'KeyA', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftRight', 'ShiftLeft'];
            if (!valuies.includes(code)) {
                return;
            }
            event.preventDefault();
            /Key/.test(code) ? code = this._changeEventCodeToArrow(code) : null;
            if (/Arrow/.test(code)) {
                code == this.direction ? this._move() : this._changeDirection(code);
            } else if (/Shift/.test(code)) {
                let time = new Date().getTime();
                if ((time - this.time) >= (1000 / this.limit)) {
                    console.log(`--> Piu <--`)
                    let name = new Date().getTime();
                    this.shots[name] = new Shot(this, name);
                    this.shots.count++;
                    this.time = time;
                }
            }
        });
    }
    /**
     * Функция удаляет с поля отображение игрока
     */
    _remove() {
        this.body.forEach((cell) => {
            let cellEl = document.querySelector(`.field_cell[data-x="${cell[0]}"][data-y="${cell[1]}"]`);
            cellEl.classList.contains('player') ? cellEl.classList.remove('player') : null;
        });
    }
    /**
     * Функция перемещает персонажа по полю
     */
    _move() {
        let nextPosition = this._getNextPosition();
        if (!this._isPositionCorrect(nextPosition)) {
            return;
        }
        this._remove();
        this.pseudoX = nextPosition[0];
        this.pseudoY = nextPosition[1];
        this.body = this._getBody();
        this._render();
    }
    /**
     * Функция проверяет: может ли игрок переместиться в позицию
     * @param {Array} position - массив координат
     */
    _isPositionCorrect(position) {
        // console.dir(field);
        let maxX = field.columns - 2;
        let maxY = field.rows - 2;
        return position[0] <= maxX && position[0] >= 1 && position[1] <= maxY && position[1] >= 1;
    }
    /**
     * Функция возвращает следующую позицию игрока
     * по текущему направлению
     */
    _getNextPosition() {
        let x = this.pseudoX;
        let y = this.pseudoY;
        switch (this.direction) {
            case 'ArrowUp':
                y -= 1;
                break;
            case 'ArrowDown':
                y += 1;
                break;
            case 'ArrowLeft':
                x -= 1;
                break;
            case 'ArrowRight':
                x += 1;
                break;
        }
        return [x, y];
    }
    /**
     * Функция меняет направление игрока и отрисовывает его
     * корректное положение
     * @param {String} value - значение нового направления,
     * полученное в event
     */
    _changeDirection(value) {
        this.direction = value;
        this._remove();
        this._render();
    }
    /**
     * Функция меняет значение клавишной "стрелки" на Arrow+
     * @param {String} code - значение event.code
     * @returns {String} - значение параметра, конвертированное в Arrow-формат
     */
    _changeEventCodeToArrow(code) {
        code = code.substr(3);
        switch (code) {
            case 'W':
                code = 'ArrowUp';
                break;
            case 'S':
                code = 'ArrowDown';
                break;
            case 'A':
                code = 'ArrowLeft';
                break;
            case 'D':
                code = 'ArrowRight';
                break;
        }
        return code;
    }
    /**
     * Функция корректирует отображение игрока в на поле,
     * учитывая его текущее направление
     */
    _renderDirection() {
        let first = null;
        let second = null;
        switch (this.direction) {
            case 'ArrowUp':
                first = document.querySelector(`.field_cell[data-x="${this.body[0][0]}"][data-y="${this.body[0][1]}"]`);
                second = document.querySelector(`.field_cell[data-x="${this.body[2][0]}"][data-y="${this.body[2][1]}"]`);
                break;
            case 'ArrowDown':
                first = document.querySelector(`.field_cell[data-x="${this.body[6][0]}"][data-y="${this.body[6][1]}"]`);
                second = document.querySelector(`.field_cell[data-x="${this.body[8][0]}"][data-y="${this.body[8][1]}"]`);
                break;
            case 'ArrowRight':
                first = document.querySelector(`.field_cell[data-x="${this.body[2][0]}"][data-y="${this.body[2][1]}"]`);
                second = document.querySelector(`.field_cell[data-x="${this.body[8][0]}"][data-y="${this.body[8][1]}"]`);
                break;
            case 'ArrowLeft':
                first = document.querySelector(`.field_cell[data-x="${this.body[0][0]}"][data-y="${this.body[0][1]}"]`);
                second = document.querySelector(`.field_cell[data-x="${this.body[6][0]}"][data-y="${this.body[6][1]}"]`);
                break;
        }
        first.classList.contains('player') ? first.classList.remove('player') : console.log('All right!');
        second.classList.contains('player') ? second.classList.remove('player') : console.log('All right!');
    }
    /**
     * Функция создает массив из координат клеток,
     * которые заняты игроком
     * @param {Number} pseudoX - псевдо Х - фактически координата Х
     * левой верхней клетки игрока
     * @param {Number} pseudoY - псевдо У - фактически координата У
     * левой верхней клетки игрока
     * @returns {Array} - список пар координат клеток игрока,
     * перечень: слева - направо, сверху - вниз
     */
    _getBody(pseudoX = this.pseudoX, pseudoY = this.pseudoY) {
        return [
            [pseudoX, pseudoY], [pseudoX + 1, pseudoY], [pseudoX + 2, pseudoY],
            [pseudoX, pseudoY + 1], [pseudoX + 1, pseudoY + 1], [pseudoX + 2, pseudoY + 1],
            [pseudoX, pseudoY + 2], [pseudoX + 1, pseudoY + 2], [pseudoX + 2, pseudoY + 2],
        ];
    }
}