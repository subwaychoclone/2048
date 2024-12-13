// 기본 변수 설정
const size = 4;
let tiles = [];
let score = 0;

// 초기화
function initGame() {
  tiles = Array(size * size).fill(0);
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  tiles.forEach(() => {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    grid.appendChild(tile);
  });
  spawnTile();
  spawnTile();
  updateGrid();
  updateScore();
}

// 랜덤 타일 생성
function spawnTile() {
  const emptyTiles = tiles.map((value, index) => value === 0 ? index : null).filter(index => index !== null);
  if (emptyTiles.length === 0) return;
  const randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  tiles[randomIndex] = Math.random() > 0.1 ? 2 : 4;
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

// 점수 업데이트
function updateScore() {
  document.getElementById('score').textContent = score;
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

// 이동 처리
function slide(row) {
  row = row.filter(value => value);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row[i + 1] = 0;
    }
  }
  return row.filter(value => value);
}

// 방향에 따른 이동
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

    const newRow = slide(row);
    while (newRow.length < size) {
      direction === 'right' || direction === 'down' ? newRow.unshift(0) : newRow.push(0);
    }
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
    updateScore();
    checkGameOver();
  }
}

// 키 입력 처리
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft': move('left'); break;
    case 'ArrowRight': move('right'); break;
    case 'ArrowUp': move('up'); break;
    case 'ArrowDown': move('down'); break;
  }
});

// 초기화 실행
initGame();
