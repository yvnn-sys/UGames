const board = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('best-score');
const gameOverScreen = document.getElementById('game-over');
const finalMessage = document.getElementById('final-message');
const restartBtn = document.getElementById('restart-btn');

let grid = [];
let score = 0;
let bestScore = localStorage.getItem('2048-bestScore') || 0;
let hasWon = false;
let isGameOver = false;

bestScoreElement.innerText = bestScore;

function initGame() {
    grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    score = 0;
    hasWon = false;
    isGameOver = false;
    scoreElement.innerText = score;
    gameOverScreen.style.display = 'none';
    board.innerHTML = '';
    
    // Create initial grid
    for(let i=0; i<4; i++) {
        for(let j=0; j<4; j++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.id = `cell-${i}-${j}`;
            board.appendChild(cell);
        }
    }
    
    addRandomTile();
    addRandomTile();
    updateBoard();
}

function addRandomTile() {
    let emptyCells = [];
    for(let i=0; i<4; i++) {
        for(let j=0; j<4; j++) {
            if(grid[i][j] === 0) {
                emptyCells.push({r: i, c: j});
            }
        }
    }
    if(emptyCells.length > 0) {
        let randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
    }
}

function updateBoard() {
    for(let i=0; i<4; i++) {
        for(let j=0; j<4; j++) {
            let cell = document.getElementById(`cell-${i}-${j}`);
            let val = grid[i][j];
            cell.innerText = val === 0 ? '' : val;
            cell.setAttribute('data-value', val);
            
            // Check win condition
            if(val === 2048 && !hasWon) {
                hasWon = true;
                showWinScreen();
            }
        }
    }
    
    scoreElement.innerText = score;
    if(score > bestScore) {
        bestScore = score;
        bestScoreElement.innerText = bestScore;
        localStorage.setItem('2048-bestScore', bestScore);
    }
}

function showWinScreen() {
    finalMessage.innerText = "You Win!";
    restartBtn.innerText = "Lanjut Main";
    gameOverScreen.style.display = 'flex';
}

function showGameOverScreen() {
    isGameOver = true;
    finalMessage.innerText = "Game Over!";
    restartBtn.innerText = "Coba Lagi";
    gameOverScreen.style.display = 'flex';
}

function move(direction) {
    if(isGameOver) return;
    
    let moved = false;
    let newGrid = JSON.parse(JSON.stringify(grid));

    if(direction === 'up' || direction === 'down') {
        for(let c=0; c<4; c++) {
            let column = [grid[0][c], grid[1][c], grid[2][c], grid[3][c]];
            if(direction === 'down') column.reverse();
            let newColumn = slideAndMerge(column);
            if(direction === 'down') newColumn.reverse();
            
            for(let r=0; r<4; r++) {
                if(newGrid[r][c] !== newColumn[r]) moved = true;
                newGrid[r][c] = newColumn[r];
            }
        }
    } else if(direction === 'left' || direction === 'right') {
        for(let r=0; r<4; r++) {
            let row = grid[r];
            if(direction === 'right') row.reverse();
            let newRow = slideAndMerge(row);
            if(direction === 'right') newRow.reverse();
            
            for(let c=0; c<4; c++) {
                if(newGrid[r][c] !== newRow[c]) moved = true;
                newGrid[r][c] = newRow[c];
            }
        }
    }

    if(moved) {
        grid = newGrid;
        addRandomTile();
        updateBoard();
        checkGameOver();
    }
}

function slideAndMerge(line) {
    // slide
    let newLine = line.filter(val => val !== 0);
    // merge
    for(let i=0; i<newLine.length-1; i++) {
        if(newLine[i] === newLine[i+1]) {
            newLine[i] *= 2;
            score += newLine[i];
            newLine[i+1] = 0;
        }
    }
    // slide again after merge
    newLine = newLine.filter(val => val !== 0);
    // fill zeros
    while(newLine.length < 4) {
        newLine.push(0);
    }
    return newLine;
}

function checkGameOver() {
    // Check if any empty cells
    for(let i=0; i<4; i++) {
        for(let j=0; j<4; j++) {
            if(grid[i][j] === 0) return false;
        }
    }
    // Check if any possible merges
    for(let i=0; i<4; i++) {
        for(let j=0; j<3; j++) {
            if(grid[i][j] === grid[i][j+1]) return false;
        }
    }
    for(let j=0; j<4; j++) {
        for(let i=0; i<3; i++) {
            if(grid[i][j] === grid[i+1][j]) return false;
        }
    }
    
    showGameOverScreen();
    return true;
}

function restartGame() {
    if(hasWon && !isGameOver && restartBtn.innerText === "Lanjut Main") {
        gameOverScreen.style.display = 'none';
    } else {
        initGame();
    }
}

window.addEventListener('keydown', e => {
    // Prevent default scrolling for arrow keys
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
    
    switch(e.key) {
        case 'ArrowUp': move('up'); break;
        case 'ArrowDown': move('down'); break;
        case 'ArrowLeft': move('left'); break;
        case 'ArrowRight': move('right'); break;
    }
});

// Initialize on load
initGame();
