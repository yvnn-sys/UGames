document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('#grid');
    const flagsLeftDisplay = document.querySelector('#flagsLeft');
    const scoreValDisplay = document.querySelector('#scoreVal');
    const restartBtn = document.querySelector('#restartBtn');
    const playAgainBtn = document.querySelector('#playAgainBtn');
    const overlay = document.querySelector('#gameOverOverlay');
    const endMessage = document.querySelector('#endMessage');

    const width = 10;
    const bombAmount = 10;
    let flags = 0;
    let squares = [];
    let isGameOver = false;
    let score = 0;

    function createBoard() {
        grid.innerHTML = '';
        squares = [];
        flags = 0;
        score = 0;
        isGameOver = false;
        flagsLeftDisplay.innerHTML = bombAmount;
        scoreValDisplay.innerHTML = score;
        overlay.classList.add('hidden');

        // Get shuffled game array with random bombs
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width * width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5);

        for(let i = 0; i < width * width; i++) {
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add('cell');
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            squares.push(square);

            // Normal click
            square.addEventListener('click', function(e) {
                click(square);
            });

            // Right click
            square.oncontextmenu = function(e) {
                e.preventDefault();
                addFlag(square);
            }
        }

        // Add numbers
        for (let i = 0; i < squares.length; i++) {
            let total = 0;
            const isLeftEdge = (i % width === 0);
            const isRightEdge = (i % width === width -1);

            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && squares[i -1].classList.contains('bomb')) total++;
                if (i > 9 && !isRightEdge && squares[i +1 -width].classList.contains('bomb')) total++;
                if (i > 10 && squares[i -width].classList.contains('bomb')) total++;
                if (i > 11 && !isLeftEdge && squares[i -1 -width].classList.contains('bomb')) total++;
                if (i < 98 && !isRightEdge && squares[i +1].classList.contains('bomb')) total++;
                if (i < 90 && !isLeftEdge && squares[i -1 +width].classList.contains('bomb')) total++;
                if (i < 88 && !isRightEdge && squares[i +1 +width].classList.contains('bomb')) total++;
                if (i < 89 && squares[i +width].classList.contains('bomb')) total++;
                squares[i].setAttribute('data', total);
            }
        }
    }

    createBoard();

    function addFlag(square) {
        if (isGameOver) return;
        if (!square.classList.contains('revealed') && (flags < bombAmount)) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag');
                square.innerHTML = '🚩';
                flags++;
                flagsLeftDisplay.innerHTML = bombAmount - flags;
                checkForWin();
            } else {
                square.classList.remove('flag');
                square.innerHTML = '';
                flags--;
                flagsLeftDisplay.innerHTML = bombAmount - flags;
            }
        } else if (!square.classList.contains('revealed') && square.classList.contains('flag')) {
             square.classList.remove('flag');
             square.innerHTML = '';
             flags--;
             flagsLeftDisplay.innerHTML = bombAmount - flags;
        }
    }

    function click(square) {
        let currentId = square.id;
        if (isGameOver) return;
        if (square.classList.contains('revealed') || square.classList.contains('flag')) return;
        
        if (square.classList.contains('bomb')) {
            gameOver(square);
        } else {
            let total = square.getAttribute('data');
            if (total != 0) {
                square.classList.add('revealed');
                square.innerHTML = total;
                square.classList.add('num-' + total);
                score += 10;
                scoreValDisplay.innerHTML = score;
                checkForWin();
                return;
            }
            checkSquare(square, currentId);
        }
        square.classList.add('revealed');
        score += 5;
        scoreValDisplay.innerHTML = score;
        checkForWin();
    }

    // Check neighboring squares
    function checkSquare(square, currentId) {
        const isLeftEdge = (currentId % width === 0);
        const isRightEdge = (currentId % width === width -1);

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) -1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentId) +1 -width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 10) {
                const newId = squares[parseInt(currentId -width)].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId > 11 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) -1 -width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 98 && !isRightEdge) {
                const newId = squares[parseInt(currentId) +1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) -1 +width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 88 && !isRightEdge) {
                const newId = squares[parseInt(currentId) +1 +width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if (currentId < 89) {
                const newId = squares[parseInt(currentId) +width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
        }, 10);
    }

    function gameOver(square) {
        isGameOver = true;
        endMessage.innerHTML = 'Game Over!';
        endMessage.style.color = 'var(--accent-color)';
        
        // Show all bombs
        squares.forEach(sq => {
            if (sq.classList.contains('bomb')) {
                sq.innerHTML = '💣';
                sq.classList.add('revealed');
            }
        });

        setTimeout(() => overlay.classList.remove('hidden'), 1000);
    }

    function checkForWin() {
        let matches = 0;
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++;
            }
            if (matches === bombAmount) {
                isGameOver = true;
                endMessage.innerHTML = 'Kamu Menang!';
                endMessage.style.color = 'var(--accent-safe)';
                setTimeout(() => overlay.classList.remove('hidden'), 500);
            }
        }
    }

    restartBtn.addEventListener('click', createBoard);
    playAgainBtn.addEventListener('click', createBoard);
});
