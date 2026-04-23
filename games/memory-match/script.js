const board = document.getElementById('board');
const movesCountDisplay = document.getElementById('movesCount');
const timeCountDisplay = document.getElementById('timeCount');
const restartBtn = document.getElementById('restartBtn');

// Emojis for cards
const items = ['🚀', '🛸', '👾', '🎮', '🕹️', '🌌', '🌠', '🤖'];
let cardsArray = [...items, ...items]; // Duplicate for pairs
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer;
let seconds = 0;
let gameStarted = false;

function initGame() {
    board.innerHTML = '';
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    gameStarted = false;
    flippedCards = [];
    
    movesCountDisplay.textContent = moves;
    timeCountDisplay.textContent = seconds;
    clearInterval(timer);

    // Shuffle
    cardsArray.sort(() => Math.random() - 0.5);

    // Create cards
    cardsArray.forEach((item, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.item = item;

        const front = document.createElement('div');
        front.classList.add('card-face', 'card-front');
        front.textContent = item;

        const back = document.createElement('div');
        back.classList.add('card-face', 'card-back');

        card.appendChild(front);
        card.appendChild(back);
        
        card.addEventListener('click', flipCard);
        board.appendChild(card);
    });
}

function startTimer() {
    if (!gameStarted) {
        gameStarted = true;
        timer = setInterval(() => {
            seconds++;
            timeCountDisplay.textContent = seconds;
        }, 1000);
    }
}

function flipCard() {
    startTimer();
    
    if (flippedCards.length < 2 && !this.classList.contains('flip')) {
        this.classList.add('flip');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            moves++;
            movesCountDisplay.textContent = moves;
            checkMatch();
        }
    }
}

function checkMatch() {
    const card1 = flippedCards[0];
    const card2 = flippedCards[1];

    if (card1.dataset.item === card2.dataset.item) {
        // Match
        matchedPairs++;
        flippedCards = [];
        
        if (matchedPairs === items.length) {
            clearInterval(timer);
            setTimeout(() => {
                alert(`Selamat! Anda menang dalam ${moves} langkah dan ${seconds} detik!`);
            }, 500);
        }
    } else {
        // Not a match
        setTimeout(() => {
            card1.classList.remove('flip');
            card2.classList.remove('flip');
            flippedCards = [];
        }, 1000);
    }
}

restartBtn.addEventListener('click', initGame);

// Start first game
initGame();
