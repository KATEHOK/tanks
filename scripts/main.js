// let playersCount = 2;
let playersCount = parseInt(prompt('Сколько будет игроков?'));
while (isNaN(playersCount)) {
    playersCount = alert(parseInt('Ошибка!\nМожно вводить только цифры!\nСколько будет игроков?'));
}
const field = new Field(80, 30, playersCount);