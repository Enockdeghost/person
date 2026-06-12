// particles.js — lightweight canvas particle system for hero
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return function() {};

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const CYAN = '0, 212, 255';
  const VIOLET = '123, 94, 167';

  function rand(min, max) { return Math.random() * (max - min) + min; }

  class Particle {
    constructor() { this.reset(true); }
    reset(initial = false) {
      this.x = rand(0, W);
      this.y = initial ? rand(0, H) : H + 10;
      this.r = rand(0.5, 2.5);
      this.vy = rand(-0.15, -0.45);
      this.vx = rand(-0.1, 0.1);
      this.life = 0;
      this.maxLife = rand(200, 500);
      this.color = Math.random() > 0.5 ? CYAN : VIOLET;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.life > this.maxLife || this.y < -10) this.reset();
    }
    draw() {
      const progress = this.life / this.maxLife;
      const alpha = progress < 0.2 ? progress / 0.2 : progress > 0.8 ? 1 - (progress - 0.8) / 0.2 : 1;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${alpha * 0.6})`;
      ctx.fill();
    }
  }

  const NUM = Math.min(120, Math.floor((W * H) / 8000));
  for (let i = 0; i < NUM; i++) particles.push(new Particle());

  function drawGrid() {
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.03)';
    ctx.lineWidth = 1;
    const step = 80;
    for (let x = 0; x < W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  }
  loop();

  return () => {
    cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
  };
}