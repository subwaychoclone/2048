// 게임 설정
const size = 4;
let tiles = Array(size * size).fill(0); // 타일 초기화
let score = 0;

// 초기화 함수
function initGame() {
  const grid = document.getElementById('grid');
  grid.innerHTML = ''; // 기존 타일 초기화
  tiles = Array(size * size).fill(0); // 새 게임 초기화
  for (let i = 0; i < tiles.length; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    grid.appendChild(tile);
  }
  spawnTile();
  spawnTile();
  updateGrid();
}

// 새 숫자 생성
function spawnTile() {
  const emptyTiles = tiles
    .map((value, index) => (value === 0 ? index : null))
    .filter((index) => index !== null);
  if (emptyTiles.length === 0) return;
  const randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  tiles[randomIndex] = Math.random() < 0.9 ? 2 : 4;
}

// 타일 업데이트
function updateGrid() {
  const tileElements = document.querySelectorAll('.tile');
  tiles.forEach((value, index) => {
    const tile = tileElements[index];
    tile.textContent = value === 0 ? '' : value;
    tile.dataset.value = value;
  });
}

// 이동 로직
function slideRow(row) {
  const newRow = row.filter((value) => value !== 0); // 0 제거
  for (let i = 0; i < newRow.length - 1; i++) {
    if (newRow[i] === newRow[i + 1]) {
      newRow[i] *= 2;
      score += newRow[i];
      newRow[i + 1] = 0;
    }
  }
  return [...newRow.filter((value) => value !== 0), ...Array(size - newRow.length).fill(0)];
}

// 방향에 따라 이동 처리
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
      const index =
        direction === 'left' || direction === 'right'
          ? i * size + j
          : j * size + i;
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

// 점수 업데이트
function updateScore() {
  document.getElementById('score').textContent = score;
}

// 게임 오버 확인
function checkGameOver() {
  if (tiles.includes(0))
