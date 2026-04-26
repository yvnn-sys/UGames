document.addEventListener('DOMContentLoaded', () => {
    const boardEl = document.getElementById('board');
    const turnText = document.getElementById('turnText');
    const restartBtn = document.getElementById('restartBtn');
    const playAgainBtn = document.getElementById('playAgainBtn');
    const overlay = document.getElementById('gameOverOverlay');
    const endMessage = document.getElementById('endMessage');

    const rows = 6;
    const cols = 7;
    let currentPlayer = 1; // 1 = Red, 2 = Yellow
    let grid = [];
    let isGameOver = false;

    // Initialize board
    function init() {
        boardEl.innerHTML = '';
        grid = [];
        isGameOver = false;
        currentPlayer = 1;
        updateTurnText();
        overlay.classList.add('hidden');

        for (let r = 0; r < rows; r++) {
            let rowArray = [];
            for (let c = 0; c < cols; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.r = r;
                cell.dataset.c = c;
                cell.addEventListener('click', () => handleDrop(c));
                boardEl.appendChild(cell);
                rowArray.push(0);
            }
            grid.push(rowArray);
        }
    }

    function handleDrop(c) {
        if (isGameOver) return;

        // Find the lowest empty row in column c
        for (let r = rows - 1; r >= 0; r--) {
            if (grid[r][c] === 0) {
                grid[r][c] = currentPlayer;
                const cell = document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
                cell.classList.add(currentPlayer === 1 ? 'p1' : 'p2');
                
                if (checkWin(r, c)) {
                    gameOver(currentPlayer);
                    return;
                }

                if (checkDraw()) {
                    gameOver(0);
                    return;
                }

                currentPlayer = currentPlayer === 1 ? 2 : 1;
                updateTurnText();
                return;
            }
        }
    }

    function checkWin(r, c) {
        return checkDirection(r, c, 1, 0) || // Horizontal
               checkDirection(r, c, 0, 1) || // Vertical
               checkDirection(r, c, 1, 1) || // Diagonal /
               checkDirection(r, c, 1, -1);  // Diagonal \
    }

    function checkDirection(r, c, dr, dc) {
        let count = 0;
        let player = grid[r][c];

        for (let i = -3; i <= 3; i++) {
            let nr = r + i * dr;
            let nc = c + i * dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === player) {
                count++;
                if (count === 4) return true;
            } else {
                count = 0;
            }
        }
        return false;
    }

    function checkDraw() {
        for (let c = 0; c < cols; c++) {
            if (grid[0][c] === 0) return false;
        }
        return true;
    }

    function gameOver(winner) {
        isGameOver = true;
        if (winner === 1) {
            endMessage.textContent = 'Pemain 1 Menang!';
            endMessage.className = 'p1';
        } else if (winner === 2) {
            endMessage.textContent = 'Pemain 2 Menang!';
            endMessage.className = 'p2';
        } else {
            endMessage.textContent = 'Seri!';
            endMessage.className = '';
        }
        setTimeout(() => overlay.classList.remove('hidden'), 500);
    }

    function updateTurnText() {
        if (currentPlayer === 1) {
            turnText.textContent = 'Giliran: Pemain 1 (Merah)';
            turnText.className = 'p1';
        } else {
            turnText.textContent = 'Giliran: Pemain 2 (Kuning)';
            turnText.className = 'p2';
        }
    }

    restartBtn.addEventListener('click', init);
    playAgainBtn.addEventListener('click', init);

    init();
});
