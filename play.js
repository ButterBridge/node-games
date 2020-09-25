const EventEmitter = require('events');

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const player = new EventEmitter();

const game = require('./game')(player);

game.on('render', (board) => {
  for (let i = 0; i < 9; i += 3) {
    console.log(board.slice(i, i + 3).join(' | '));
    if (i < 6) console.log('--------------');
  }
});

game.on('resolve', (winner) => {
  console.log(`${winner} won!`);
  process.exit();
});

game.init();

rl.on('line', (input) => {
  player.emit('move', input);
});
