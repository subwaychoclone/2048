// game_script.js
let coins = 0; // 코인 수
let items = []; // 구매한 아이템
const size = 4;
let tiles = [];

// 초기화 함수
function initGrid() {
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
}

// 숫자 타일 생성
function spawnTile() {
  let emptyTiles = tiles.map((v, i) => (v === 0 ? i : null)).filter(v => v !== null);
  if (emptyTiles.length === 0) return;
  let index = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  tiles[index] = Math.random() > 0.1 ? 2 : 4;
}

// 숫자 타일 업데이트
function updateGrid() {
  const tileElements = document.querySelectorAll('.tile');
  tiles.forEach((value, i) => {
    tileElements[i].textContent = value > 0 ? value : '';
    tileElements[i].setAttribute('data-value', value);
  });
}

// 게임 오버 처리
function checkGameOver() {
  if (tiles.includes(0)) return;
  alert(`Game Over! You earned ${coins} coins.`);
  coins += Math.max(...tiles); // 가장 높은 수에 따라 코인 추가
  // 메인 화면으로 이동
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

// 이동 처리
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

// 슬라이드 및 합치기
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

// 아이템 구매 및 사용 표시
function updateItems() {
  const itemsContainer = document.getElementById('items');
  itemsContainer.innerHTML = '';
  items.forEach((item) => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('item');
    itemElement.setAttribute('data-uses', item.uses);
    itemElement.textContent = item.name;
    itemsContainer.appendChild(itemElement);
  });
}

// 초기화 호출
initGrid();
updateItems();

// 키보드 입력 처리
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft': move('left'); break;
    case 'ArrowRight': move('right'); break;
    case 'ArrowUp': move('up'); break;
    case 'ArrowDown': move('down'); break;
  }
});
