/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * the board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is an array of cells  (board[y][x])

/** makeBoard: create the in-JS board structure:
 *   board = array of rows, each row is an array of cells  (board[y][x])
 */

function makeBoard() {
  for (let y = 0; y < HEIGHT; y++) {
    board.push(Array.from({ length: WIDTH }));
  }
}

/** makeHtmlBoard: create HTML table and row of column tops. */

function makeHtmlBoard() {
  const boardElement = document.getElementById('board');

  // Create column tops (clickable area for adding a piece to that column)
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.addEventListener('click', handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', x);
    top.append(headCell);
  }

  boardElement.append(top);

  // Create the main part of the board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');

    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }

    boardElement.append(row);
  }
}

/** findSpotForCol: given column x, return the top empty y (null if filled) */

function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update the DOM to place a piece into the HTML table of the board */

function placeInTable(y, x) {
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  piece.style.top = -50 * (y + 2) + 'px'; // Add 'px' to specify the unit

  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}

/** endGame: announce the game end */

function endGame(msg) {
  alert(msg);
}

/** handleClick: handle the click of a column top to play a piece */

function handleClick(evt) {
  // Get x from the ID of the clicked cell
  const x = +evt.target.id;

  // Get the next spot in the column (if none, ignore the click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // Place the piece in the board and add it to the HTML table
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // Check for a win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // Check for a tie
  if (board.every(row => row.every(cell => cell))) {
    return endGame('Tie!');
  }

  // Switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check the board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all the color of the current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // Get a "check list" of 4 cells (starting here) for each of the different
      // ways to win
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // Find a winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
