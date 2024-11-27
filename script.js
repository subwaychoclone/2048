// script.js
const grid = document.getElementById('grid');
const message = document.getElementById('message');
const size = 4;
let tiles = [];

// Initialize the grid
function initGrid() {
  tiles = Array(size * size).fill(0);
  grid.innerHTML = '';
  tiles.forEach(() => {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    grid.appendChild(tile);
  });
  spawnTile();
  spawnTile();
  updateGrid();
}

// Spawn a new tile
function spawnTile() {
  let emptyTiles = tiles.map((v, i) => (v === 0 ? i : null)).filter(v => v !== null);
  if (emptyTiles.length === 0) return;
  let index = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  tiles[index] = Math.random() > 0.1 ? 2 : 4;
}

// Update the grid display
function updateGrid() {
  const tileElements = document.querySelectorAll('.tile');
  tiles.forEach((value, i) => {
    tileElements[i].textContent = value > 0 ? value : '';
    tileElements[i].setAttribute('data-value', value);
  });
}

// Move and merge tiles
function slide(row) {
  row = row.filter(v => v);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
    }
  }
  return row.filter(v => v);
}

function move(direction) {
  let moved = false;
  for (let i = 0; i < size; i++) {
    let row;
    if (direction === 'left' || direction === 'right') {
      row = tiles.slice(i * size, i * size + size);
      if (direction === 'right') row.reverse();
    } else {
      row = tiles.filter((_, index) => index % size === i);
      if (direction === 'down') row.reverse();
    }

    const newRow = slide(row);
    while (newRow.length < size) {
      if (direction === 'right' || direction === 'down') {
        newRow.unshift(0);
      } else {
        newRow.push(0);
      }
    }
    if (direction === 'right' || direction === 'down') newRow.reverse();

    for (let j = 0; j < size; j++) {
      const index = direction === 'left' || direction === 'right'
        ? i * size + j
        : j * size + i;
      if (tiles[index] !== newRow[j]) {
        moved = true;
      }
      tiles[index] = newRow[j];
    }
  }

  if (moved) {
    spawnTile();
    updateGrid();
    checkGameOver();
  }
}

// Check if game is over
function checkGameOver() {
  if (tiles.includes(0)) return;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = i * size + j;
      if (
        (j < size - 1 && tiles[index] === tiles[index + 1]) ||
        (i < size - 1 && tiles[index] === tiles[index + size])
      ) {
        return;
      }
    }
  }
  message.textContent = 'Game Over!';
}

// Listen for arrow key inputs
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      move('left');
      break;
    case 'ArrowRight':
      move('right');
      break;
    case 'ArrowUp':
      move('up');
      break;
    case 'ArrowDown':
      move('down');
      break;
  }
});

// Start the game
initGrid();
