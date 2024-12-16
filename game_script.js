const gameBoard = document.getElementById("game-board");
const scoreElement = document.getElementById("score");
const restartButton = document.getElementById("restart-button");

let board = [];
let score = 0;

function initializeBoard() {
    board = Array.from({ length: 4 }, () => Array(4).fill(0));
    addRandomTile();
    addRandomTile();
    updateBoard();
}

function addRandomTile() {
    const emptyTiles = [];
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) emptyTiles.push([r, c]);
        }
    }
    if (emptyTiles.length > 0) {
        const [row, col] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateBoard() {
    gameBoard.innerHTML = "";
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const value = board[r][c];
            const tile = document.createElement("div");
            tile.className = "tile";
            if (value > 0) {
                tile.setAttribute("data-value", value);
                tile.innerHTML = `<span>${value}</span>`;
            }
            gameBoard.appendChild(tile);
        }
    }
    scoreElement.textContent = score;
}

function slide(row) {
    const nonZero = row.filter(value => value !== 0);
    const newRow = [];
    while (nonZero.length > 0) {
        if (nonZero.length > 1 && nonZero[0] === nonZero[1]) {
            newRow.push(nonZero.shift() * 2);
            score += newRow[newRow.length - 1];
            nonZero.shift();
        } else {
            newRow.push(nonZero.shift());
        }
    }
    while (newRow.length < 4) newRow.push(0);
    return newRow;
}

function rotateBoard() {
    const newBoard = Array.from({ length: 4 }, () => Array(4).fill(0));
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            newBoard[c][3 - r] = board[r][c];
        }
    }
    board = newBoard;
}

function move(direction) {
    let rotated = 0;
    if (direction === "up") rotated = 1;
    else if (direction === "right") rotated = 2;
    else if (direction === "down") rotated = 3;

    for (let i = 0; i < rotated; i++) rotateBoard();
    let moved = false;

    for (let r = 0; r < 4; r++) {
        const newRow = slide(board[r]);
        if (newRow.toString() !== board[r].toString()) moved = true;
        board[r] = newRow;
    }

    for (let i = 0; i < (4 - rotated) % 4; i++) rotateBoard();

    if (moved) {
        addRandomTile();
        updateBoard();
    }
}

function handleInput(event) {
    switch (event.key) {
        case "ArrowUp":
            move("up");
            break;
        case "ArrowDown":
            move("down");
            break;
        case "ArrowLeft":
            move("left");
            break;
        case "ArrowRight":
            move("right");
            break;
    }
}

restartButton.addEventListener("click", () => {
    score = 0;
    initializeBoard();
});

window.addEventListener("keydown", handleInput);

initializeBoard();
