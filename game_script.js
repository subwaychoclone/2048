// 게임 설정
const size = 4;
let tiles = Array(size * size).fill(0);
let score = 0;

// 초기화 함수
function initGame() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  tiles = Array(size * size).fill(0);
  for (let i = 0; i < tiles.length; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    grid.appendChild(tile);
  }
  spawnTile();
  spawnTile();
  updateGrid();
}

// 숫자 추가
function spawnTile() {
  const emptyTiles = tiles.map((v, i) => (v === 0 ? i : null)).filter((i) => i !== null);
  if (emptyTiles.length > 0) {
    const randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    tiles[randomIndex] = 2;
  }
}

// 타일 업데이트
function updateGrid() {
  const tileElements = document.querySelectorAll('.tile');
  tiles.forEach((value, index) => {
    const tile = tileElements[index];
    tile.textContent = value > 0 ? value : '';
    tile.dataset.value = value;
  });
}

// 이동 처리
function slideRow(row) {
  const nonZero = row.filter((num) => num !== 0);
  for (let i = 0; i < nonZero.length - 1; i++) {
    if (nonZero[i] === nonZero[i + 1]) {
      nonZero[i] *= 2;
      score += nonZero[i];
      nonZero[i + 1] = 0;
    }
  }
  return nonZero.filter((num) => num !== 0).concat(Array(size - nonZero.length).fill(0));
}

function move(direction) {
  let moved = false;

  for (let i = 0; i < size; i++) {
    let row = [];
    if (direction === 'left' || direction === 'right') {
      row = tiles.slice(i * size, i * size + size);
      if (direction === 'right') row.reverse();
    } else {
      row = tiles.filter((_, index) => index % size === i);
      if (direction === 'down') row.reverse();
    }

    const newRow = slideRow(row);
    if (direction === 'right' || direction === 'down') newRow.reverse();

    for (let j = 0; j < size; j++) {
      const index = direction === 'left' || direction === 'right' ? i * size + j : j * size + i;
      if (tiles[index] !== newRow[j]) moved = true;
      tiles[index] = newRow[j];
    }
  }

  if (moved) {
    spawnTile();
    updateGrid();
    checkGameOver();
  }
}

// 게임 오버 확인
function checkGameOver() {
  if (tiles.includes(0)) return false;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size - 1; j++) {
      if (tiles[i * size + j] === tiles[i * size + j + 1] || tiles[j * size + i] === tiles[(j + 1) * size + i]) {
        return false;
      }
    }
  }
  document.getElementById('message').classList.remove('hidden');
  return true;
}

// 키 입력 처리
window.addEventListener('keydown', (e) => {
  const directions = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down',
  };
  if (directions[e.key]) {
    move(directions[e.key]);
  }
});

// 초기화 실행
initGame();
