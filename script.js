document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const scoreDisplay = document.getElementById('score');
  const eatSound = document.getElementById('eatSound');
  const gameOverSound = document.getElementById('gameOverSound');
  const bgMusic = document.getElementById('bgMusic');
  const startScreen = document.getElementById('startScreen');
  const settings = document.getElementById('settings');
  const controls = document.getElementById('controls');
  const flash = document.getElementById('flash');
  const levelDisplay = document.getElementById('level');
  const toNextLevelDisplay = document.getElementById('toNextLevel');
  const candyTypes = ['🍬', '🍭', '🍫', '🍩', '🍪', '🍡'];
  let candies = [];

  const characterSelect = document.getElementById('characterSelect');
  const speedSelect     = document.getElementById('speedSelect');
  const muteButton      = document.getElementById('muteButton');
  const startButton     = document.getElementById('startButton');

  let headImg       = new Image();
  let snake         = [{ x: 10, y: 10 }];
  let dx = 0, dy    = 0;
  const gridSize    = 30;
  let intervalId, isRunning = false, score = 0, level = 1;
  let currentSpeed  = parseInt(speedSelect.value, 10);
  const colors      = ['#0f0','#0ff','#ff0','#f0f','#f00','#00f'];

  function getRandomPosition() {
    const tileX = Math.floor(canvas.width  / gridSize);
    const tileY = Math.floor(canvas.height / gridSize);
    return {
      x: Math.floor(Math.random() * tileX),
      y: Math.floor(Math.random() * tileY)
    };
  }

  function flashEffect() {
    flash.style.display   = 'block';
    flash.style.animation = 'none';
    flash.offsetHeight;
    flash.style.animation = 'flashFade 0.4s forwards';
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '30px monospace';
    ctx.fillStyle = '#fff';
    candies.forEach(c => {
      ctx.fillText(c.emoji, c.x * gridSize + 4, c.y * gridSize + 24);
    });

    snake.forEach((seg, idx) => {
      if (idx === 0) {
        ctx.drawImage(
          headImg,
          seg.x * gridSize,
          seg.y * gridSize,
          gridSize * 2,
          gridSize * 2
        );
      } else {
        ctx.beginPath();
        ctx.arc(
          seg.x * gridSize + gridSize / 2,
          seg.y * gridSize + gridSize / 2,
          gridSize / 2.2,
          0, 2 * Math.PI
        );
        ctx.fillStyle = colors[level % colors.length];
        ctx.fill();
      }
    });
  }

  function handleDirection(key) {
    switch (key) {
      case 'ArrowUp':    if (dy === 0) { dx = 0; dy = -1; } break;
      case 'ArrowDown':  if (dy === 0) { dx = 0; dy = 1;  } break;
      case 'ArrowLeft':  if (dx === 0) { dx = -1; dy = 0; } break;
      case 'ArrowRight': if (dx === 0) { dx = 1; dy = 0;  } break;
    }
  }

  function gameLoop() {
    const tx = Math.floor(canvas.width / gridSize);
    const ty = Math.floor(canvas.height / gridSize);
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (
      head.x < 0 || head.x >= tx ||
      head.y < 0 || head.y >= ty ||
      snake.slice(1).some(p => p.x === head.x && p.y === head.y)
    ) {
      gameOverSound.play();
      alert('¡Game Over!');
      bgMusic.pause();
      bgMusic.currentTime = 0;

      isRunning = false;
      clearInterval(intervalId);

      settings.style.display    = 'flex';
      startScreen.style.display = 'flex';
      controls.style.display    = 'none';
      canvas.style.display      = 'none';

      dx = 0;
      dy = 0;
      snake = [{ x: 10, y: 10 }];
      return;
    }

    const eatenIndex = candies.findIndex(c => c.x === head.x && c.y === head.y);
    if (eatenIndex !== -1) {
      const eatenCandy = candies[eatenIndex];
      candies.splice(eatenIndex, 1);

      score++;
      eatSound.play();
      flashEffect();

      scoreDisplay.textContent = `🍬 ${score}`;
      toNextLevelDisplay.textContent = `⏳ ${5 - (score % 5)} para siguiente`;

      if (candies.length === 0) generateCandies();

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

    draw();
  }

  function startGame() {
    headImg.src      = characterSelect.value;
    currentSpeed     = parseInt(speedSelect.value, 10);
    bgMusic.play();

    settings.style.display    = 'none';
    startScreen.style.display = 'none';
    controls.style.display    = 'flex';
    canvas.style.display      = 'block';

    snake = [{ x: 10, y: 10 }];
    dx = 0; dy = 0;
    score = 0; level = 1;
    scoreDisplay.textContent       = `🍬 ${score}`;
    levelDisplay.textContent       = `🧱 Nivel: ${level}`;
    toNextLevelDisplay.textContent = `⏳ ${5 - (score % 5)} para siguiente`;

    clearInterval(intervalId);
    generateCandies();
    intervalId = setInterval(gameLoop, currentSpeed);
    isRunning  = true;
  }

  function generateCandies() {
    const count = Math.floor(Math.random() * 4) + 2;
    candies = [];
    for (let i = 0; i < count; i++) {
      candies.push({
        x: Math.floor(Math.random() * Math.floor(canvas.width / gridSize)),
        y: Math.floor(Math.random() * Math.floor(canvas.height / gridSize)),
        emoji: candyTypes[Math.floor(Math.random() * candyTypes.length)]
      });
    }
  }

  startButton.addEventListener('click', startGame);
  muteButton.addEventListener('click', () => {
    if (bgMusic.paused) {
      bgMusic.play();
      muteButton.textContent = '🔊';
    } else {
      bgMusic.pause();
      muteButton.textContent = '🔇';
    }
  });

  document.addEventListener('keydown', e => {
    if (!isRunning && ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
      startGame();
    }
    if (isRunning) handleDirection(e.key);
  });

  ['up','down','left','right'].forEach(id => {
    const btn = document.getElementById(id);
    const keyMap = { up:'ArrowUp', down:'ArrowDown', left:'ArrowLeft', right:'ArrowRight' }[id];
    ['touchstart','pointerdown','click'].forEach(evt => {
      btn.addEventListener(evt, e => {
        e.preventDefault();
        if (!isRunning) startGame();
        handleDirection(keyMap);
      });
    });
  });

  settings.style.display    = 'flex';
  startScreen.style.display = 'flex';
  controls.style.display    = 'none';
  canvas.style.display      = 'none';
});