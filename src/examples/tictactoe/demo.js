import m from 'mithril';

function gameModel() {
  return {
    board: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
    isX: true,
  };
}

function getWinner(board) {
  const winningBoards = [
    // horizontal
    [0, 1, 2], // board: [[x, x, x], [_, _, _], [_, _, _]]
    [3, 4, 5], // board: [[_, _, _], [x, x, x], [_, _, _]]
    [6, 7, 8], // board: [[_, _, _], [_, _, _], [x, x, x]]

    // vertical
    [0, 3, 6], // board: [[x, _, _], [x, _, _], [x, _, _]]
    [1, 4, 7], // board: [[_, x, _], [_, x, _], [_, x, _]]
    [2, 5, 8], // board: [[_, _, x], [_, _, x], [_, _, x]]

    // diagonal
    [0, 4, 8], // board: [[x, _, _], [_, x, _], [_, _, x]]
    [2, 4, 6], // board: [[_, _, x], [_, x, _], [x, _, _]]
  ];

  // Convert winning board numbers (like 2, 4, 6) to
  // row/column pairs (like [0, 2], [1, 1], [2, 0])
  // then access the values on the board at those locations.
  // If board[0][2] is 'X', and so are board[1][1] and board[2][0]
  // then 'X' is our winner.
  for (let i = 0; i < winningBoards.length; i++) {
    const [a, b, c] = winningBoards[i];
    const [aRow, aCol] = [Math.floor(a / 3), a % 3];
    const [bRow, bCol] = [Math.floor(b / 3), b % 3];
    const [cRow, cCol] = [Math.floor(c / 3), c % 3];
    const [aPlayer, bPlayer, cPlayer] = [
      board[aRow][aCol],
      board[bRow][bCol],
      board[cRow][cCol],
    ];
    if (aPlayer && aPlayer === bPlayer && aPlayer === cPlayer) {
      return aPlayer;
    }
  }
  return null;

}

function getLabel(model) {
  const winner = getWinner(model.board);
  const player = model.isX ? 'X' : 'O';
  return winner ?
    ('Winner is: ' + winner) :
    ('Player is: ' + player);
}

function move(model, row, column) {
  // only move if game isn't over and location is available
  if (!getWinner(model.board) && !model.board[row][column]) {
    const player = model.isX ? 'X' : 'O';
    model.board[row][column] = player;
    model.isX = !model.isX;
  }
}

export default function Board() {
  let model = gameModel();
  return {
    view() {
      return [
        m('button.right', {
          onclick() { model = gameModel(); },
        }, 'Reset'),
        m('div', getLabel(model)),
        m('table.Board',
          model.board.map(function(row, i) {
            return m('tr', row.map(function(value, j) {
              return m('td.Square', {
                onclick() {
                  move(model, i, j);
                },
              }, value);
            }));
          })
        ),
      ];
    },
  };
}
