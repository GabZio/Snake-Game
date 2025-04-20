
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

const gridSize = 30;
let tileCountX = Math.floor(canvas.width / gridSize);
let tileCountY = Math.floor(canvas.height / gridSize);

let snake = [{ x: 10, y: 10 }];
let dx = 0;
let dy = 0;
let food = getRandomPosition();
let intervalId = null;
let isRunning = false;
let score = 0;
let level = 1;
const headImg = new Image();
headImg.src = "snake_head_nobg_resized.png";

function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * tileCountX),
    y: Math.floor(Math.random() * tileCountY),
  };
}
function showFlash() {
  flash.style.display = "block";
  flash.style.animation = "none";
  flash.offsetHeight;
  flash.style.animation = "flashFade 0.4s forwards";
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
    showFlash();
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
  if (
    head.x < 0 || head.x >= tileCountX ||
    head.y < 0 || head.y >= tileCountY ||
    snake.slice(1).some(p => p.x === head.x && p.y === head.y)
  ) {
    gameOverSound.play();
    alert("¡Game Over!");
    snake = [{ x: 10, y: 10 }];
    dx = 0; dy = 0;
    food = getRandomPosition();
    score = 0; level = 1;
    scoreDisplay.textContent = `🍰 ${score}`;
    toNextLevelDisplay.textContent = `⏳ ${5 - (score % 5)} para siguiente`;
    currentSpeed = 150;
    toggleGame(false);
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "24px monospace";
  ctx.fillStyle = "#fff";
  ctx.fillText("🍰", food.x * gridSize + 4, food.y * gridSize + 24);
  snake.forEach((segment, index) => {
    if (index === 0) {
      ctx.drawImage(headImg, segment.x * gridSize, segment.y * gridSize, gridSize * 2, gridSize * 2);
    } else {
      ctx.beginPath();
      ctx.arc(segment.x * gridSize + gridSize/2, segment.y * gridSize + gridSize/2, gridSize/2.2, 0, 2*Math.PI);
      ctx.fillStyle = '#0f0';
      ctx.fill();
    }
  });
}
function toggleGame(startOverride = null) {
  const shouldRun = startOverride !== null ? startOverride : !isRunning;
  if (shouldRun) {
    intervalId = setInterval(gameLoop, currentSpeed);
  } else {
    clearInterval(intervalId);
  }
  isRunning = shouldRun;
}
let currentSpeed = 150;
document.addEventListener("keydown", e => {
  if (!isRunning && ["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
    startScreen.style.display="none";
    canvas.style.display="block";
    controls.style.display="flex";
    toggleGame(true);
  }
  switch(e.key) {
    case "ArrowUp": if(dy===0){dx=0;dy=-1;} break;
    case "ArrowDown": if(dy===0){dx=0;dy=1;} break;
    case "ArrowLeft": if(dx===0){dx=-1;dy=0;} break;
    case "ArrowRight": if(dx===0){dx=1;dy=0;} break;
  }
});
document.querySelectorAll('.speed-button').forEach(btn => {
  btn.addEventListener('click', ()=>{
    currentSpeed = parseInt(btn.dataset.speed);
    if(isRunning){ clearInterval(intervalId); intervalId = setInterval(gameLoop, currentSpeed); }
  });
});
function startGameIfNeeded(){
  if(!isRunning){
    startScreen.style.display="none";
    canvas.style.display="block";
    controls.style.display="flex";
    toggleGame(true);
  }
}
// Direct touch handlers
document.getElementById("up").addEventListener("click", ()=>{
  startGameIfNeeded();
  if(dy===0){dx=0;dy=-1;}
});
document.getElementById("down").addEventListener("click", ()=>{
  startGameIfNeeded();
  if(dy===0){dx=0;dy=1;}
});
document.getElementById("left").addEventListener("click", ()=>{
  startGameIfNeeded();
  if(dx===0){dx=-1;dy=0;}
});
document.getElementById("right").addEventListener("click", ()=>{
  startGameIfNeeded();
  if(dx===0){dx=1;dy=0;}
});
