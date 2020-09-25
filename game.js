const EventEmitter = require('events');

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

class Game extends EventEmitter {
  constructor(player) {
    super();
    this.board = Array(9)
      .fill()
      .map((_, i) => `(${i + 1})`);
    player.on('move', this.playerMove);
  }

  init = () => {
    console.log('let us play');
    this.emit('render', this.board);
  };

  playerMove = (move) => {
    if (['#', '!'].includes(this.board[move - 1])) {
      console.log('space already used :(');
      this.emit('render', this.board);
    } else if (!this.board[move - 1]) {
      console.log('not a valid move');
      this.emit('render', this.board);
    } else {
      this.board[move - 1] = '!';

      if (
        winConditions.some((condition) =>
          condition.every((position) => this.board[position] === '!')
        )
      ) {
        this.emit('render', this.board);
        this.emit('resolve', 'player');
      } else {
        const threatConditions = winConditions.filter((condition) => {
          let counts = {
            '!': 0,
            '#': 0,
          };
          for (let position of condition) {
            counts[this.board[position]]++;
          }
          return counts['!'] === 2 && counts['#'] === 0;
        });

        const freeIndexes = (threatConditions.length
          ? threatConditions[
              Math.floor(Math.random() * threatConditions.length)
            ]
          : Array(9)
              .fill()
              .map((_, i) => i)
        ).reduce(
          (freeIndexes, position) =>
            ['#', '!'].includes(this.board[position])
              ? freeIndexes
              : [...freeIndexes, position],
          []
        );

        const aiPlayIndex =
          freeIndexes[Math.floor(Math.random() * freeIndexes.length)];

        this.board[aiPlayIndex] = '#';

        if (
          winConditions.some((condition) =>
            condition.every((position) => this.board[position] === '#')
          )
        ) {
          this.emit('render', this.board);
          this.emit('resolve', 'ai');
        } else {
          this.emit('render', this.board);
        }
      }
    }
  };
}

module.exports = (player) => {
  return new Game(player);
};
