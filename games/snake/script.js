const board = document.querySelector("#gameBoard");
const ctx = board.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const restartBtn = document.querySelector("#restartBtn");
const gameOverScreen = document.querySelector("#gameOverScreen");
const finalScore = document.querySelector("#finalScore");
const tryAgainBtn = document.querySelector("#tryAgainBtn");

const gameWidth = board.width;
const gameHeight = board.height;
const unitSize = 20;

let snake = [
    {x: unitSize * 4, y: 0},
    {x: unitSize * 3, y: 0},
    {x: unitSize * 2, y: 0},
    {x: unitSize, y: 0},
    {x: 0, y: 0}
];

let foodX;
let foodY;
let score = 0;
let xVelocity = unitSize;
let yVelocity = 0;
let running = false;
let gameInterval;
let speed = 100;

window.addEventListener("keydown", changeDirection);
restartBtn.addEventListener("click", resetGame);
tryAgainBtn.addEventListener("click", resetGame);

// Mobile Controls
document.getElementById('upBtn').addEventListener('click', () => changeDirection({keyCode: 38}));
document.getElementById('downBtn').addEventListener('click', () => changeDirection({keyCode: 40}));
document.getElementById('leftBtn').addEventListener('click', () => changeDirection({keyCode: 37}));
document.getElementById('rightBtn').addEventListener('click', () => changeDirection({keyCode: 39}));

// Draw initial state
ctx.fillStyle = "#ffffff";
ctx.fillRect(0, 0, gameWidth, gameHeight);

function gameStart() {
    running = true;
    scoreText.textContent = `Skor: ${score}`;
    gameOverScreen.classList.add("hidden");
    createFood();
    drawFood();
    nextTick();
}

function nextTick() {
    if (running) {
        gameInterval = setTimeout(() => {
            clearBoard();
            drawGrid();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, speed);
    } else {
        displayGameOver();
    }
}

function clearBoard() {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function drawGrid() {
    ctx.strokeStyle = "rgba(0, 0, 0, 0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= gameWidth; i += unitSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, gameHeight);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(gameWidth, i);
        ctx.stroke();
    }
}

function createFood() {
    function randomFood(min, max) {
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);
}

function drawFood() {
    ctx.fillStyle = "#ef4444";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(239, 68, 68, 0.5)";
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
    ctx.shadowBlur = 0; // Reset
}

function moveSnake() {
    const head = {x: snake[0].x + xVelocity, y: snake[0].y + yVelocity};
    snake.unshift(head);

    if (snake[0].x == foodX && snake[0].y == foodY) {
        score += 10;
        scoreText.textContent = `Skor: ${score}`;
        createFood();
        // Increase speed slightly
        if (speed > 50) speed -= 2;
    } else {
        snake.pop();
    }
}

function drawSnake() {
    ctx.shadowBlur = 5;
    ctx.shadowColor = "rgba(34, 197, 94, 0.5)";
    
    snake.forEach((part, index) => {
        // Head is slightly different color
        ctx.fillStyle = index === 0 ? "#16a34a" : "#22c55e";
        ctx.fillRect(part.x, part.y, unitSize, unitSize);
        ctx.strokeStyle = "#ffffff";
        ctx.strokeRect(part.x, part.y, unitSize, unitSize);
    });
    
    ctx.shadowBlur = 0; // Reset
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    switch (true) {
        case (keyPressed == LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case (keyPressed == UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case (keyPressed == RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case (keyPressed == DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
}

function checkGameOver() {
    // Walls
    if (snake[0].x < 0 || snake[0].x >= gameWidth || 
        snake[0].y < 0 || snake[0].y >= gameHeight) {
        running = false;
    }

    // Body
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
            running = false;
        }
    }
}

function displayGameOver() {
    gameOverScreen.classList.remove("hidden");
    finalScore.textContent = score;
}

function resetGame() {
    clearTimeout(gameInterval);
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    speed = 100;
    snake = [
        {x: unitSize * 4, y: 0},
        {x: unitSize * 3, y: 0},
        {x: unitSize * 2, y: 0},
        {x: unitSize, y: 0},
        {x: 0, y: 0}
    ];
    gameStart();
}
