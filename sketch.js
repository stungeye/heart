// Math Heart for Valentine's Day
// Parametric heart curve with pulsing mini-heart particles.
// Wally Glutton stungeye.com 2024-02-14
// This is free and unencumbered software released into the public domain. See unlicense.org.

let particles = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  noStroke();
}

// Heart curve point at parameter t
function heartXY(t) {
  return [
    16 * pow(sin(t), 3),
    -(13 * cos(t) - 5 * cos(2 * t) - 2 * cos(3 * t) - cos(4 * t)),
  ];
}

// Draw a heart at (0,0) of given size. Step controls resolution.
function drawHeart(sz, step = 0.2) {
  beginShape();
  for (let t = 0; t < TWO_PI; t += step) {
    let [hx, hy] = heartXY(t);
    vertex(hx * sz, hy * sz);
  }
  endShape(CLOSE);
}

// Heartbeat pulse and its velocity (derivative)
function heartbeat() {
  let f = frameCount;
  let beat = 1 + 0.06 * sin(f * 0.08) + 0.03 * sin(f * 0.16);
  let vel = 0.06 * 0.08 * cos(f * 0.08) + 0.03 * 0.16 * cos(f * 0.16);
  return { beat, vel };
}

// Spawn a particle on the heart edge with outward momentum
function spawnParticle(s) {
  let t = random(TWO_PI);
  let [x, y] = heartXY(t);
  let norm = abs(x) + abs(y) + 0.1;
  return {
    x: x * s,
    y: y * s,
    vx: (x / norm) * random(0.5, 1.5),
    vy: (y / norm) * random(0.5, 1.5),
    life: 255,
    hue: random(340, 370) % 360,
    sz: random(3, 7),
  };
}

// Apply heartbeat impulse, update motion, and cull dead particles
function updateParticles(impulse) {
  for (let p of particles) {
    let d = sqrt(p.x * p.x + p.y * p.y) + 0.1;
    p.vx += (p.x / d) * impulse;
    p.vy += (p.y / d) * impulse;
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    fill(p.hue, 80, 100, p.life);
    push();
    translate(p.x, p.y);
    drawHeart(p.sz / 16);
    pop();
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 3;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

// Feathered solid heart drawn as layered shells
function drawFeatheredHeart(s) {
  for (let k = 5; k >= 0; k--) {
    fill(350, 85, 90, map(k, 5, 0, 8, 95));
    drawHeart(s * (1 + k * 0.018), 0.05);
  }
}

// Math overlay text centered on the heart
function drawMathOverlay(s) {
  fill(340, 60, 20);
  textFont("Georgia");
  textAlign(CENTER, CENTER);
  let dy = s * 1.6;

  textStyle(ITALIC);
  textSize(s * 1.4);
  text("Heart Curve", 0, -s * 5 + dy);

  textStyle(NORMAL);
  textSize(s * 1.1);
  text("x = 16 sin³(t)", 0, -s * 2.8 + dy);
  text("y = 13cos(t) − 5cos(2t) − 2cos(3t) − cos(4t)", 0, -s * 0.8 + dy);

  textStyle(ITALIC);
  textSize(s * 1.4);
  text("Heartbeat", 0, s * 1.6 + dy);

  textStyle(NORMAL);
  textSize(s * 1.1);
  text("s(t) = 1 + 0.06 sin(ωt) + 0.03 sin(2ωt)", 0, s * 3.6 + dy);
}

function draw() {
  background(340, 30, 10, 25);
  translate(width / 2, height / 2);

  let { beat, vel } = heartbeat();
  let s = (min(width, height) / 42) * beat;

  for (let i = 0; i < 3; i++) {
    particles.push(spawnParticle(s));
  }

  updateParticles(max(0, vel) * 40);
  drawFeatheredHeart(s);
  drawMathOverlay(s);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
