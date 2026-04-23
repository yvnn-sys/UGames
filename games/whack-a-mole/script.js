const holes = document.querySelectorAll('.hole');
const scoreBoard = document.getElementById('score');
const bestScoreBoard = document.getElementById('best-score');
const timeBoard = document.getElementById('time');
const moles = document.querySelectorAll('.mole');
const gameOverScreen = document.getElementById('game-over');
const finalMessage = document.getElementById('final-message');

let lastHole;
let timeUp = false;
let score = 0;
let bestScore = localStorage.getItem('whackamole-bestScore') || 0;
let timeLeft = 30;
let countdownTimer;

bestScoreBoard.textContent = bestScore;

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
    const idx = Math.floor(Math.random() * holes.length);
    const hole = holes[idx];
    if (hole === lastHole) {
        return randomHole(holes);
    }
    lastHole = hole;
    return hole;
}

function peep() {
    // Dynamic difficulty: faster as time decreases
    const difficultyMultiplier = Math.max(0.4, timeLeft / 30); // 1.0 -> 0.4
    const time = randomTime(400 * difficultyMultiplier, 1000 * difficultyMultiplier);
    
    const hole = randomHole(holes);
    const mole = hole.querySelector('.mole');
    
    // Enable clicking again when it pops up
    mole.style.pointerEvents = 'auto';
    hole.classList.add('up');
    
    setTimeout(() => {
        hole.classList.remove('up');
        if (!timeUp) peep();
    }, time);
}

function startGame() {
    gameOverScreen.style.display = 'none';
    scoreBoard.textContent = 0;
    timeUp = false;
    score = 0;
    timeLeft = 30;
    timeBoard.textContent = timeLeft;
    
    peep();
    
    countdownTimer = setInterval(() => {
        timeLeft--;
        timeBoard.textContent = timeLeft;
        if(timeLeft <= 0) {
            clearInterval(countdownTimer);
            timeUp = true;
            finalMessage.innerText = `Skor Anda: ${score}`;
            
            if(score > bestScore) {
                bestScore = score;
                bestScoreBoard.textContent = bestScore;
                localStorage.setItem('whackamole-bestScore', bestScore);
                finalMessage.innerText = `Rekor Baru! Skor: ${score}`;
            }
            
            gameOverScreen.style.display = 'flex';
        }
    }, 1000);
}

function bonk(e) {
    if(!e.isTrusted) return; // cheater!
    
    score++;
    scoreBoard.textContent = score;
    this.parentNode.classList.remove('up');
    
    // Disable clicking until next popup to prevent double clicks
    this.style.pointerEvents = 'none'; 
}

moles.forEach(mole => mole.addEventListener('mousedown', bonk));
