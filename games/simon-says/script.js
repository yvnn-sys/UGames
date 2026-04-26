const pads = ['green', 'red', 'yellow', 'blue'];
let gameSequence = [];
let playerSequence = [];
let level = 0;
let playing = false;

const startBtn = document.getElementById('startBtn');
const levelText = document.getElementById('levelText');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalLevel = document.getElementById('finalLevel');
const playAgainBtn = document.getElementById('playAgainBtn');

startBtn.addEventListener('click', startGame);
playAgainBtn.addEventListener('click', startGame);

const padElements = {
    green: document.getElementById('green'),
    red: document.getElementById('red'),
    yellow: document.getElementById('yellow'),
    blue: document.getElementById('blue')
};

// Add click listeners to pads
for (let color in padElements) {
    padElements[color].addEventListener('click', () => {
        if (!playing) return;
        
        playerSequence.push(color);
        activatePad(color);
        checkSequence(playerSequence.length - 1);
    });
}

function startGame() {
    gameSequence = [];
    playerSequence = [];
    level = 0;
    playing = false;
    gameOverOverlay.classList.add('hidden');
    startBtn.disabled = true;
    startBtn.style.opacity = '0.5';
    nextLevel();
}

function nextLevel() {
    level++;
    levelText.textContent = `Level ${level}`;
    playerSequence = [];
    playing = false;

    const randomColor = pads[Math.floor(Math.random() * 4)];
    gameSequence.push(randomColor);

    playSequence();
}

function playSequence() {
    let delay = 0;
    gameSequence.forEach((color, index) => {
        setTimeout(() => {
            activatePad(color);
        }, delay);
        delay += 600;
    });

    setTimeout(() => {
        playing = true;
    }, delay);
}

function activatePad(color) {
    const pad = padElements[color];
    pad.classList.add('active');
    
    // Play sound (optional, using Web Audio API or just visual for now)
    // Here we just do visual
    setTimeout(() => {
        pad.classList.remove('active');
    }, 300);
}

function checkSequence(currentLevel) {
    if (gameSequence[currentLevel] === playerSequence[currentLevel]) {
        if (playerSequence.length === gameSequence.length) {
            setTimeout(() => {
                nextLevel();
            }, 1000);
        }
    } else {
        gameOver();
    }
}

function gameOver() {
    playing = false;
    startBtn.disabled = false;
    startBtn.style.opacity = '1';
    finalLevel.textContent = level;
    
    // Flash red
    document.body.style.backgroundColor = 'var(--pad-red)';
    setTimeout(() => {
        document.body.style.backgroundColor = 'var(--bg-color)';
    }, 200);

    gameOverOverlay.classList.remove('hidden');
}
