const canvas = document.getElementById("pong-canvas");
const ctx = canvas.getContext("2d");

// Load Scores
const playerScoreEl = document.getElementById("player-score");
const aiScoreEl = document.getElementById("ai-score");
const gameOverScreen = document.getElementById("game-over");
const finalMessage = document.getElementById("final-message");

// Game Constants
const paddleWidth = 10, paddleHeight = 100;
const ballRadius = 8;
const WINNING_SCORE = 10;
let isGameOver = false;
let animationId;

// Entities
const user = {
    x: 0,
    y: canvas.height/2 - paddleHeight/2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#3b82f6",
    score: 0
};

const ai = {
    x: canvas.width - paddleWidth,
    y: canvas.height/2 - paddleHeight/2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#f472b6",
    score: 0
};

const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: ballRadius,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "#0f172a"
};

// Controls
canvas.addEventListener("mousemove", getMousePos);

function getMousePos(evt){
    let rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - user.height/2;
    
    // Constrain user paddle to canvas
    if (user.y < 0) user.y = 0;
    if (user.y + user.height > canvas.height) user.y = canvas.height - user.height;
}

function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.speed = 5;
    // Alternate serve direction
    ball.velocityX = -ball.velocityX;
    ball.velocityY = (Math.random() > 0.5 ? 1 : -1) * 5;
}

// Drawing Functions
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.shadowBlur = 5;
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.fillRect(x, y, w, h);
    ctx.shadowBlur = 0;
}

function drawCircle(x, y, r, color){
    ctx.fillStyle = color;
    ctx.shadowBlur = 5;
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(canvas.width/2 - 1, i, 2, 10, "rgba(15, 23, 42, 0.1)");
    }
}

// Collision Detection
function collision(b, p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

// Update Loop
function update(){
    if(isGameOver) return;

    // Move ball
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // AI Logic (Bounded Speed to be beatable)
    let destY = ball.y - (ai.height/2);
    let dy = destY - ai.y;
    let maxSpeed = 5.5; // Cap AI speed
    
    if (dy > maxSpeed) ai.y += maxSpeed;
    else if (dy < -maxSpeed) ai.y -= maxSpeed;
    else ai.y += dy * 0.15;
    
    // Constrain AI paddle to canvas
    if(ai.y < 0) ai.y = 0;
    if(ai.y + ai.height > canvas.height) ai.y = canvas.height - ai.height;

    // Wall collision
    if(ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0){
        ball.velocityY = -ball.velocityY;
    }

    // Paddle collision
    let player = (ball.x < canvas.width/2) ? user : ai;

    if(collision(ball, player)){
        // Avoid getting stuck in paddle
        if(ball.x < canvas.width/2) ball.x = player.x + player.width + ball.radius;
        else ball.x = player.x - ball.radius;
        
        // Where hit
        let collidePoint = (ball.y - (player.y + player.height/2));
        collidePoint = collidePoint / (player.height/2);
        
        let angleRad = (Math.PI/4) * collidePoint;
        
        // Change direction
        let direction = (ball.x < canvas.width/2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        
        // Speed up
        ball.speed += 0.5;
    }

    // Update Score
    if(ball.x - ball.radius < 0){
        // AI scores
        updateScore('ai');
    } else if(ball.x + ball.radius > canvas.width){
        // User scores
        updateScore('user');
    }
}

function updateScore(winner){
    if(winner === 'ai') {
        ai.score++;
        aiScoreEl.innerText = ai.score;
    } else {
        user.score++;
        playerScoreEl.innerText = user.score;
    }
    
    if(ai.score >= WINNING_SCORE || user.score >= WINNING_SCORE) {
        isGameOver = true;
        finalMessage.innerText = user.score >= WINNING_SCORE ? 'Anda Menang!' : 'Anda Kalah!';
        gameOverScreen.style.display = 'flex';
    } else {
        resetBall();
    }
}

function restartGame() {
    user.score = 0;
    ai.score = 0;
    playerScoreEl.innerText = user.score;
    aiScoreEl.innerText = ai.score;
    isGameOver = false;
    gameOverScreen.style.display = 'none';
    resetBall();
}

function render(){
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawNet();
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function game(){
    update();
    render();
    if(!isGameOver) {
        animationId = requestAnimationFrame(game);
    } else {
        // keep rendering to show static screen
        requestAnimationFrame(game);
    }
}

// Start Game
resetBall();
game();
