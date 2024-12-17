const gameBoard = document.getElementById("game-board");
const scoreElement = document.getElementById("score");
const coinsElement = document.getElementById("coins");

let board = [];
let score = 0;
let coins = 0;

function initializeBoard() {
    board = Array.from({ length: 4 }, () => Array(4).fill(0));
    score = 0;
    coins = 0;
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
            tile.className = "tile" + (value > 0 ? ` tile-${value}` : "");
            if (value > 0) {
                tile.textContent = value;
            }
            gameBoard.appendChild(tile);
        }
    }
    scoreElement.textContent = score;
    coinsElement.textContent = coins;
    checkGameOver();
}

function slide(row) {
    const nonZero = row.filter(value => value !== 0);
    const newRow = [];
    while (nonZero.length > 0) {
        if (nonZero.length > 1 && nonZero[0] === nonZero[1]) {
            const newValue = nonZero.shift() * 2;
            newRow.push(newValue);
            score += newValue;
            coins += Math.floor(newValue / 16); // 코인 보상 낮춤
            nonZero.shift();
        } else {
            newRow.push(nonZero.shift());
        }
    }
    while (newRow.length < 4) newRow.push(0);
    return newRow;
}

function rotateBoard(times) {
    for (let t = 0; t < times; t++) {
        const newBoard = Array.from({ length: 4 }, () => Array(4).fill(0));
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                newBoard[c][3 - r] = board[r][c];
            }
        }
        board = newBoard;
    }
}

function move(direction) {
    let rotated = 0;
    if (direction === "down") rotated = 2; // 위아래 반전
    else if (direction === "left") rotated = 1;
    else if (direction === "right") rotated = 3;

    rotateBoard(rotated);
    let moved = false;

    for (let r = 0; r < 4; r++) {
        const newRow = slide(board[r]);
        if (newRow.toString() !== board[r].toString()) moved = true;
        board[r] = newRow;
    }

    rotateBoard((4 - rotated) % 4);

    if (moved) {
        addRandomTile();
        updateBoard();
    }
}

function checkGameOver() {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) return false;
            if (c < 3 && board[r][c] === board[r][c + 1]) return false;
            if (r < 3 && board[r][c] === board[r + 1][c]) return false;
        }
    }
    setTimeout(() => {
        if (confirm("게임 오버! 더 남는 칸이 없습니다.")) {
            initializeBoard();
        }
    }, 200);
    return true;
}

function handleInput(event) {
    switch (event.key) {
        case "ArrowUp":
            move("down"); // 반전
            break;
        case "ArrowDown":
            move("up"); // 반전
            break;
        case "ArrowLeft":
            move("left");
            break;
        case "ArrowRight":
            move("right");
            break;
    }
}

window.addEventListener("keydown", handleInput);
initializeBoard();
