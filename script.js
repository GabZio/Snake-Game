
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const eatSound = document.getElementById("eatSound");
const gameOverSound = document.getElementById("gameOverSound");
const startScreen = document.getElementById("startScreen");
const controls = document.getElementById("controls");
const flash = document.getElementById("flash");
const levelDisplay = document.getElementById("level");
const toNextLevelDisplay = document.getElementById("toNextLevel");
const colors = ["#0f0", "#0ff", "#ff0", "#f0f", "#f00", "#00f"];

let snake = [{ x: 10, y: 10 }];
let dx = 0, dy = 0;
let gridSize = 30;
let tileCountX, tileCountY;
let food = getRandomPosition();
let intervalId = null;
let isRunning = false;
let score = 0;
let level = 1;
let currentSpeed = 150;

const headImg = new Image();
headImg.src = "snake_head_nobg_resized.png";

function getRandomPosition() {
  tileCountX = Math.floor(canvas.width / gridSize);
  tileCountY = Math.floor(canvas.height / gridSize);
  return {
    x: Math.floor(Math.random() * tileCountX),
    y: Math.floor(Math.random() * tileCountY),
  };
}

function startGame() {
  startScreen.style.display = "none";
  canvas.style.display = "block";
  controls.style.display = "flex";
  snake = [{ x: 10, y: 10 }];
  dx = dy = 0;
  score = 0;
  level = 1;
  scoreDisplay.textContent = `🍰 ${score}`;
  levelDisplay.textContent = `🧱 Nivel: ${level}`;
  toNextLevelDisplay.textContent = `⏳ ${5 - (score % 5)} para siguiente`;
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(gameLoop, currentSpeed);
  isRunning = true;
}

function gameLoop() {
  tileCountX = Math.floor(canvas.width / gridSize);
  tileCountY = Math.floor(canvas.height / gridSize);
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = getRandomPosition();
    score++;
    eatSound.play();
    flashEffect();
    scoreDisplay.textContent = `🍰 ${score}`;
    toNextLevelDisplay.textContent = `⏳ ${5 - (score % 5)} para siguiente`;
    if (score % 5 === 0) {
      level++;
      levelDisplay.textContent = `🧱 Nivel: ${level}`;
      currentSpeed = Math.max(80, currentSpeed - 20);
      clearInterval(intervalId);
      intervalId = setInterval(gameLoop, currentSpeed);
    }
  } else {
    snake.pop();
  }

  if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY ||
      snake.slice(1).some(p => p.x === head.x && p.y === head.y)) {
    gameOverSound.play();
    alert("¡Game Over!");
    isRunning = false;
    startScreen.style.display = "flex";
    canvas.style.display = "none";
    controls.style.display = "none";
    return;
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "24px monospace";
  ctx.fillStyle = "#fff";
  ctx.fillText("🍰", food.x * gridSize + 4, food.y * gridSize + 24);
  snake.forEach((seg, idx) => {
    if (idx === 0) {
      ctx.drawImage(headImg, seg.x * gridSize, seg.y * gridSize, gridSize*2, gridSize*2);
    } else {
      ctx.beginPath();
      ctx.arc(seg.x*gridSize + gridSize/2, seg.y*gridSize + gridSize/2, gridSize/2.2, 0, 2*Math.PI);
      ctx.fillStyle = '#0f0';
      ctx.fill();
    }
  });
}

function flashEffect() {
  flash.style.display = "block";
  flash.style.animation = "none";
  flash.offsetHeight;
  flash.style.animation = "flashFade 0.4s forwards";
}

document.addEventListener("keydown", e => {
  if (!isRunning) {
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
      startGame();
      handleDirection(e.key);
    }
  } else {
    handleDirection(e.key);
  }
});

function handleDirection(key) {
  switch(key) {
    case "ArrowUp":    if(dy===0){dx=0; dy=-1;} break;
    case "ArrowDown":  if(dy===0){dx=0; dy=1;} break;
    case "ArrowLeft":  if(dx===0){dx=-1; dy=0;} break;
    case "ArrowRight": if(dx===0){dx=1; dy=0;} break;
  }
}

["up","down","left","right"].forEach(id => {
  const btn = document.getElementById(id);
  const key = {
    up:    "ArrowUp",
    down:  "ArrowDown",
    left:  "ArrowLeft",
    right: "ArrowRight"
  }[id];
  btn.addEventListener("touchstart", e => {
    e.preventDefault();
    if (!isRunning) {
      startGame();
    }
    handleDirection(key);
  });
});

