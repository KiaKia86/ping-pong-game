const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startPage = document.getElementById('startPage');
const startButton = document.getElementById('startButton');
const pauseMusicButton = document.getElementById('pauseMusic');
const gameContainer = document.querySelector('.game-container');
const scoreElement = document.getElementById('score');
const backgroundMusic = document.getElementById('backgroundMusic');

// Game variables
let ball = { x: 400, y: 300, dx: 4, dy: 4, radius: 10 };
let paddle1 = { x: 10, y: 250, width: 10, height: 100, dy: 0 };
let paddle2 = { x: 780, y: 250, width: 10, height: 100, dy: 0 };
let player1Score = 0;
let player2Score = 0;

// Paddle speed (pixels per frame)
const paddleSpeed = 8;

// Key states for smooth movement
const keys = {
  w: false,
  s: false,
  ArrowUp: false,
  ArrowDown: false,
};

// Event listeners for keydown and keyup
document.addEventListener('keydown', (e) => {
  if (e.key in keys) keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key in keys) keys[e.key] = false;
});

// Update paddle positions based on key states
function updatePaddles() {
  // Player 1 (W and S keys)
  if (keys.w && paddle1.y > 0) paddle1.dy = -paddleSpeed;
  else if (keys.s && paddle1.y < canvas.height - paddle1.height) paddle1.dy = paddleSpeed;
  else paddle1.dy = 0;

  // Player 2 (Arrow Up and Arrow Down keys)
  if (keys.ArrowUp && paddle2.y > 0) paddle2.dy = -paddleSpeed;
  else if (keys.ArrowDown && paddle2.y < canvas.height - paddle2.height) paddle2.dy = paddleSpeed;
  else paddle2.dy = 0;

  // Update paddle positions
  paddle1.y += paddle1.dy;
  paddle2.y += paddle2.dy;
}

// Draw ball
function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#0f0';
  ctx.fill();
  ctx.closePath();
}

// Draw paddles
function drawPaddles() {
  ctx.fillStyle = '#0f0';
  ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height); // Player 1 paddle
  ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height); // Player 2 paddle
}

// Update game state
function update() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Ball collision with walls
  if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
  }

  // Ball collision with paddles
  if (
    (ball.x - ball.radius < paddle1.x + paddle1.width && ball.y > paddle1.y && ball.y < paddle1.y + paddle1.height) ||
    (ball.x + ball.radius > paddle2.x && ball.y > paddle2.y && ball.y < paddle2.y + paddle2.height)
  ) {
    ball.dx = -ball.dx;
  }

  // Ball out of bounds
  if (ball.x - ball.radius < 0) {
    player2Score++;
    resetBall();
  }
  if (ball.x + ball.radius > canvas.width) {
    player1Score++;
    resetBall();
  }

  // Update score
  scoreElement.textContent = `Player 1: ${player1Score} | Player 2: ${player2Score}`;
}

// Reset ball position
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.dx = -ball.dx;
}

// Render game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  drawPaddles();
  updatePaddles();
  update();
  requestAnimationFrame(draw);
}

// Start game
startButton.addEventListener('click', () => {
  startPage.style.display = 'none';
  gameContainer.style.display = 'block';

  // Resize canvas to full screen
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Adjust paddle positions for the new canvas size
  paddle1.x = 10;
  paddle1.y = canvas.height / 2 - paddle1.height / 2;
  paddle2.x = canvas.width - 20;
  paddle2.y = canvas.height / 2 - paddle2.height / 2;

  // Reset ball position
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;

  draw();
});

// Music controls
pauseMusicButton.addEventListener('click', () => {
  if (backgroundMusic.paused) {
    backgroundMusic.play().catch(() => {
      console.error("Failed to play music. Ensure the file is in the correct location.");
    });
    pauseMusicButton.textContent = 'Pause Music';
  } else {
    backgroundMusic.pause();
    pauseMusicButton.textContent = 'Play Music';
  }
});

// Start music automatically
backgroundMusic.play().catch(() => {
  console.error("Failed to play music. Ensure the file is in the correct location.");
});