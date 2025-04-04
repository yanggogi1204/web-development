let bullets = [];
let enemies = [];
let lastSpawnTime = 0;
let spawnInterval = 1000;
let enemySpeed = 1.5;
let score = 0;
let health = 3;
let gameOver = false;
let killCount = 0;
let shotCount = 1;

function setup() {
  createCanvas(600, 600);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(20);
}

function draw() {
  background(240);
  let cx = width / 2;
  let cy = height / 2;

  if (!gameOver) {
    let angle = atan2(mouseY - cy, mouseX - cx);

    // 포신
    push();
    translate(cx, cy);
    rotate(angle);
    fill(80);
    rect(10, 0, 60, 15);
    pop();

    // 몸통
    fill(100, 150, 200);
    ellipse(cx, cy, 50, 50);

    // 포탄
    for (let i = bullets.length - 1; i >= 0; i--) {
      let b = bullets[i];
      b.update();
      b.display();
      if (b.isOffScreen()) {
        bullets.splice(i, 1);
      }
    }

    // 적 생성
    if (millis() - lastSpawnTime > spawnInterval) {
      spawnEnemies();
      lastSpawnTime = millis();
      enemySpeed = min(enemySpeed + 0.1, 4);
    }

    // 적 업데이트
    for (let i = enemies.length - 1; i >= 0; i--) {
      let e = enemies[i];
      e.update(cx, cy);

      // 포탄과 충돌
      for (let j = bullets.length - 1; j >= 0; j--) {
        if (!e.dead && e.hitBy(bullets[j])) {
          e.die();
          bullets.splice(j, 1);
          score += 10;
          if (!e.counted) {
            killCount++;
            e.counted = true;
            if (killCount % 10 === 0) {
              shotCount = min(shotCount + 1, 5);
              print("샷건 강화! shotCount = " + shotCount);
            }
          }
          break;
        }
      }

      // 탱크와 충돌
      if (!e.dead && e.hitTank(cx, cy)) {
        e.die();
        health--;
        if (health <= 0) {
          gameOver = true;
        }
      }

      e.display();

      if (e.dead && e.deathTimer <= 0) {
        enemies.splice(i, 1);
      }
    }

    // UI
    fill(0);
    text("❤️ " + health + "    Score: " + score + "   🔫 shot: " + shotCount, width / 2, 30);
  } else {
    fill(0);
    textSize(30);
    text("GAME OVER", width / 2, height / 2 - 20);
    textSize(20);
    text("Score: " + score, width / 2, height / 2 + 20);
  }
}

function mousePressed() {
  if (gameOver) return;

  let cx = width / 2;
  let cy = height / 2;
  let angle = atan2(mouseY - cy, mouseX - cx);
  let spread = PI / 20;

  for (let i = 0; i < shotCount; i++) {
    let offset = (shotCount === 1) ? 0 : map(i, 0, shotCount - 1, -spread, spread);
    let bulletAngle = angle + offset;
    let gunLength = 50;
    let bx = cx + cos(bulletAngle) * gunLength;
    let by = cy + sin(bulletAngle) * gunLength;
    bullets.push(new Bullet(bx, by, bulletAngle));
  }
}

function spawnEnemies() {
  let count = int(random(1, 4));
  for (let i = 0; i < count; i++) {
    let x, y;
    let edge = int(random(4));
    if (edge === 0) {
      x = random(width);
      y = -30;
    } else if (edge === 1) {
      x = random(width);
      y = height + 30;
    } else if (edge === 2) {
      x = -30;
      y = random(height);
    } else {
      x = width + 30;
      y = random(height);
    }
    enemies.push(new Enemy(x, y, enemySpeed));
  }
}

// ---------------- Bullet Class ----------------
class Bullet {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.dx = cos(angle) * 6;
    this.dy = sin(angle) * 6;
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;
  }

  display() {
    fill(255, 100, 100);
    noStroke();
    ellipse(this.x, this.y, 10, 10);
  }

  isOffScreen() {
    return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
  }
}

// ---------------- Enemy Class ----------------
class Enemy {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.dead = false;
    this.deathTimer = 10;
    this.counted = false;
  }

  update(tx, ty) {
    if (this.dead) {
      this.deathTimer--;
      return;
    }
    let angle = atan2(ty - this.y, tx - this.x);
    this.x += cos(angle) * this.speed;
    this.y += sin(angle) * this.speed;
  }

  display() {
    if (this.dead) {
      fill(255, 200, 0);
      ellipse(this.x, this.y, 40, 40);
    } else {
      fill(255, 0, 0);
      ellipse(this.x, this.y, 30, 30);
    }
  }

  hitBy(b) {
    return dist(this.x, this.y, b.x, b.y) < 20;
  }

  hitTank(tx, ty) {
    return dist(this.x, this.y, tx, ty) < 30;
  }

  die() {
    this.dead = true;
  }
}
