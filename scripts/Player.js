class Player {
    constructor(index, parent, count, limit = 5, speed = 60, health = 3, maxShots = 3) {
        if (count == '1') {
            this.royal = true;
        } else {
            this.royal = false;
        }
        if (count == 2 && index == '1') {
            index = '3';
        }
        this.maxShots = maxShots;
        this.alive = true;
        this.id = index;
        this._setValuies();
        this.parent = parent;
        this.limit = limit;
        this.speed = speed;
        this.health = health;
        this.time = new Date().getTime();
        this._calcPseudoCoordsAndDirection();
        this.body = this._getBody();
        this.shots = { count: 0 };
        this._render();
        this._addKeydownEventListener();
    }
    /**
     * функция расчитывает событие атаки
     * @param {Number} power сила атаки
     */
    attacked(power = 1) {
        if (this.health - power <= 0) {
            this.health = 0;
            this._renderDamaged(false);
        } else {
            this.health -= power;
            this._renderDamaged();
        }
    }
    /**
     * функция отрисовывает эффект повреждения
     * @param {Boolean} category степень повреждения (true - повреждение / false - уничтожение)
     */
    _renderDamaged(category = true) {
        if (category) {
            this.body.forEach((cell) => {
                let cellEl = document.querySelector(`.field_cell[data-x="${cell[0]}"][data-y="${cell[1]}"]`);
                cellEl.classList.add('damage');
                setTimeout(() => cellEl.classList.remove('damage'), 30);
            });
        } else {
            this.alive = false;
            this.body.forEach((cell) => {
                let cellEl = document.querySelector(`.field_cell[data-x="${cell[0]}"][data-y="${cell[1]}"]`);
                cellEl.classList.add('dead');
            });
        }
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
                this.pseudoX = this.parent.columns - 2;
                this.pseudoY = 1;
                this.direction = 'ArrowLeft';
                break;
            case '2':
                this.pseudoX = 1;
                this.pseudoY = this.parent.rows - 2;
                this.direction = 'ArrowRight';
                break;
            case '3':
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
     * функция устанавливает возможные варианты управления
     */
    _setValuies() {
        if (this.royal) {
            console.dir(this);
            this.valuies = ['KeyW', 'KeyS', 'KeyA', 'KeyD', 'ShiftLeft', 'AltLeft', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftRight', 'KeyU', 'KeyH', 'KeyJ', 'KeyK', 'AltRight', 'Space', 'Numpad8', 'Numpad4', 'Numpad5', 'Numpad6', 'NumpadEnter', 'Numpad0'];
            return;
        }
        switch (this.id) {
            case '0':
                this.valuies = ['KeyW', 'KeyS', 'KeyA', 'KeyD', 'ShiftLeft', 'AltLeft'];
                break;
            case '1':
                this.valuies = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftRight'];
                break;
            case '2':
                this.valuies = ['KeyU', 'KeyH', 'KeyJ', 'KeyK', 'AltRight', 'Space'];
                break;
            case '3':
                this.valuies = ['Numpad8', 'Numpad4', 'Numpad5', 'Numpad6', 'NumpadEnter', 'Numpad0'];
                break;
        }
    }
    /**
     * Функция устанавливает обработчик нажатия клавиш для каждого игрока
     */
    _addKeydownEventListener() {
        window.addEventListener('keydown', event => {
            if (!this.alive) {
                return;
            }
            let code = event.code;
            if (!this.valuies.includes(code)) {
                return;
            }
            event.preventDefault();
            /Key/.test(code) ? code = this._changeKeyToArrow(code) : null;
            /Numpad/.test(code) ? code = this._changeNumpadToArrow(code) : null;
            /Alt/.test(code) ? code = 'Shift' : null;
            /Space/.test(code) ? code = 'Shift' : null;
            if (/Arrow/.test(code)) {
                code == this.direction ? this._move() : this._changeDirection(code);
            } else if (/Shift/.test(code)) {
                let time = new Date().getTime();
                if (this.shots.count < this.maxShots && (time - this.time) >= (1000 / this.limit)) {
                    console.log(`--> Piu <--`)
                    let name = new Date().getTime();
                    this.shots[name] = new Shot(this, name);
                    this.shots.count++;
                    this.time = time;
                }
                this.shots.count >= this.maxShots ? console.log('--> Nope <--') : null;
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
    _changeKeyToArrow(code) {
        code = code.substr(3);
        if (code == 'W' || code == 'U') {
            return 'ArrowUp';
        } else if (code == 'S' || code == 'J') {
            return 'ArrowDown';
        } else if (code == 'A' || code == 'H') {
            return 'ArrowLeft';
        } else if (code == 'D' || code == 'K') {
            return 'ArrowRight';
        }
    }
    /**
    * Функция меняет значение клавишной "стрелки" на Arrow+
    * @param {String} code - значение event.code
    * @returns {String} - значение параметра, конвертированное в Arrow-формат
    */
    _changeNumpadToArrow(code) {
        code = code.substr(6);
        if (code == '8') {
            return 'ArrowUp';
        } else if (code == '5') {
            return 'ArrowDown';
        } else if (code == '4') {
            return 'ArrowLeft';
        } else if (code == '6') {
            return 'ArrowRight';
        } else if (code == '0' || code == 'Enter') {
            return 'Shift';
        }
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