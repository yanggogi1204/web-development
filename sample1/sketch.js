let x,y;
let speed = 5;
let obstacle = [];
let removingObstacleID = [];

let life = 3;
let isPlaying = true;

const obstacleSizeX = 30;
const obstacleSizeY = 30;
const bonobonoSizeX = 70;
const bonobonoSizeY = 120;

const collidingMessage = ["아야!", "잘 좀 해봐", "아얏", "으악", "ㅠㅠ", "!!","에구구"];
const scoreUpMessage = ["점수 달달하다", "그거야!", "좋아", "우왕"];
let selectedMessageIndex = 0;
let pastFrameCount = 0;
let isDialogOpened = false;
let typeOfDialog = "";

let score = 0;
let bestScore = 0;

function setup() {
  createCanvas(700, 600);
  x = width/2;
  y = height - 100;
}

function draw() {
  background(230);
  
  noStroke();
  textStyle(NORMAL);
  fill(0);
  textSize(30);
  text("보노보노 게임", 40, 50);
  text(score+"점", 40, 80);

  textSize(20);
  text("최고 점수 " + bestScore + "점", 40, 110);
  textSize(30);
  
  if(life===3) text("❤️ ❤️ ❤️", width-120, 50);
  if(life===2) text("😵 ❤️ ❤️", width-120, 50);
  if(life===1) text("😵 😵 ❤️", width-120, 50);
  if(life===0) text("😵 😵 😵", width-120, 50);
  
  if(!isPlaying) {
    banabana(width/2, height/2);
    
    if(score > bestScore) {
      bestScore = score;
    }
    noStroke();
    textSize(30);
    text("게임 오버", width/2-50, height/2-120);
    
    if(mouseX>width/2-100 && mouseX<width/2+100 && mouseY>height/2+100-30 && mouseY<height/2+100+30) {
      noStroke()
      fill("#6BCB70");
      rectMode(CENTER);
      rect(width/2, height/2+100, 200, 60);

      fill(255);
      text("다시하기", width/2-50, height/2+110);

      if(mouseIsPressed) {
        score = 0;
        life = 3;
        obstacle = [];
        isPlaying = true;
        x = width/2;
        y = height - 100;
      }
    } else {
      noStroke()
      fill("#4CAF50");
      rectMode(CENTER);
      rect(width/2, height/2+100, 200, 60);

      fill(255);
      text("다시하기", width/2-50, height/2+110);
    }
  }
  
  if(isPlaying) {
    if(frameCount%30 == 0) {
    score += 1;
  }
  
    stroke(0);
    fill(50);
    if(frameCount%(30-constrain((2*(Math.floor(score/50)+1)), 0, 15)) == 0) {
      obstacle.push({id: random(1000), x: random(width), y: 0, speed: (random(4)+1)+(Math.floor(score/50)*0.4), type: randomType()});

    }

    noStroke();
    textSize(30);
    obstacle.forEach(e => {
      e.y += e.speed;
      switch(e.type) {
        case "damage":
          text("💣", e.x, e.y+26);
          break;
        case "scoreUp":
          text("💎", e.x, e.y+26);
          break;
        default:
      }


      if(e.y >= height) {
        removingObstacleID.push(e.id);
      }

      if(isColliding(e.x, e.y, obstacleSizeX, obstacleSizeY, x, y-20, bonobonoSizeX, bonobonoSizeY)) {
        removingObstacleID.push(e.id);

        typeOfDialog = e.type;
        switch(e.type) {
          case "damage":
            if(life>0) {
            life -= 1;
            }
            if(life===0) isPlaying=false;
            pastFrameCount = frameCount;
            isDialogOpened = true;
            selectedMessageIndex = Math.floor(Math.random()*(collidingMessage.length));
          case "scoreUp":
            score += 10;
            pastFrameCount = frameCount;
            isDialogOpened = true;
            selectedMessageIndex = Math.floor(Math.random()*(scoreUpMessage.length));
        }


      }
    });

    // removingObstacleID.forEach(roID => {
    //   obstacle = obstacle.filter((e) => e.id !== roID);
    // })

    obstacle = obstacle.filter(e => !removingObstacleID.includes(e.id));

    removingObstacleID = [];


    if (keyIsDown(LEFT_ARROW) && x-bonobonoSizeX/2 > 0) {
      x -= speed;
    }
    if (keyIsDown(RIGHT_ARROW) && x+bonobonoSizeX/2 < width) {
      x += speed;
    }
    if (keyIsDown(UP_ARROW) && y-bonobonoSizeY/2 > 0) {
      y -= speed;
    }
    if (keyIsDown(DOWN_ARROW) && y+bonobonoSizeY/2 < height) {
      y += speed;
    }
    banabana(x, y);

    if(isDialogOpened) {
      if((frameCount-pastFrameCount)/60 >= 1) {
        isDialogOpened = false;
      } else {
        stroke(0);
        rectMode(CORNER);
        fill(255);
        if(typeOfDialog == "damage") {rect(x-5, y-132, calcDialogXSize(collidingMessage[selectedMessageIndex]), 30);}
        else if(typeOfDialog == "scoreUp") {
          rect(x-5, y-132, calcDialogXSize(scoreUpMessage[selectedMessageIndex] + " 점수 +10"), 30);
        }
        noStroke();

        textSize(20);
        textStyle(BOLD);
        if(typeOfDialog == "damage") {fill("#F44336"); text(collidingMessage[selectedMessageIndex], x, y-110);}
        else if(typeOfDialog == "scoreUp") {fill("#2196F3"); text(scoreUpMessage[selectedMessageIndex]+" 점수 +10", x, y-110);}
      }
    }
  }
  
  
}

function banabana(x, y) {
  xPos = x;
  yPos = y;
  const banaPalette = {
    body: "#57B9EF",
    bodyStroke: "#000000",
    banana: "#FFE337"
  }; 
  
  const banaStrokeWeight = 2;
  
  // args
  stroke(banaPalette.bodyStroke);
  strokeWeight(20);
  line(xPos, yPos-40, xPos-40, yPos);
  line(xPos, yPos-40, xPos+40, yPos);
  
  stroke(banaPalette.body);
  strokeWeight(20-2*banaStrokeWeight);
  line(xPos, yPos-40, xPos-40, yPos);
  line(xPos, yPos-40, xPos+40, yPos);
  
  // legs
  stroke(banaPalette.bodyStroke);
  strokeWeight(24);
  line(xPos, yPos+28, xPos-28, yPos+38);
  line(xPos, yPos+28, xPos+28, yPos+38);
  
  stroke(banaPalette.body);
  strokeWeight(24-2*banaStrokeWeight);
  line(xPos, yPos+28, xPos-28, yPos+38);
  line(xPos, yPos+28, xPos+28, yPos+38);
  
  // body setting
  stroke(banaPalette.bodyStroke);
  strokeWeight(banaStrokeWeight);
  fill(banaPalette.body);
  
  // body
  ellipse(xPos, yPos, 70, 85);
  
  // face
  ellipse(xPos, yPos-50, 80, 80);
  
  // eyes
  noStroke();
  fill(0);
  circle(xPos-28, yPos-58, 4);
  circle(xPos+28, yPos-58, 4);
  
  // white nose
  stroke(0);
  fill(255);
  circle(xPos-7, yPos-38, 14);
  circle(xPos+7, yPos-38, 14);
  
  // black nose
  noStroke();
  fill(0);
  circle(xPos, yPos-45, 10);
  
  // suyeoms
  stroke(0);
  line(xPos-10, yPos-41, xPos-20, yPos-44);
  line(xPos+10, yPos-41, xPos+20, yPos-44);
  
  line(xPos-10, yPos-38, xPos-20, yPos-38);
  line(xPos+10, yPos-38, xPos+20, yPos-38);
  
  line(xPos-10, yPos-35, xPos-20, yPos-32);
  line(xPos+10, yPos-35, xPos+20, yPos-32);
  
  // hitbox
  // noFill();
  // stroke("#FF0000");
  // rectMode(CENTER);
  // rect(xPos, yPos-20, 70, 100);
}

function isColliding(ax, ay, asx, asy, bx, by, bsx, bsy) {
  let distance = dist(ax, ay, bx, by);
  let cosSeta = (bx - ax) / distance;
  let acosine = acos(cosSeta);

  let aInnerDis, bInnerDis;

  if ((acosine >= 0 && acosine <= atan(asy / asx)) ||
      (acosine >= PI - atan(asy / asx) && acosine <= PI)) {
    aInnerDis = (asx / 2) * (1 / cosSeta);
  } else {
    aInnerDis = (asy / 2) * (1 / cos(HALF_PI - acosine));
  }

  if ((acosine >= 0 && acosine <= atan(bsy / bsx)) ||
      (acosine >= PI - atan(bsy / bsx) && acosine <= PI)) {
    bInnerDis = (bsx / 2) * (1 / cosSeta);
  } else {
    bInnerDis = (bsy / 2) * (1 / cos(HALF_PI - acosine));
  }

  return distance - (abs(aInnerDis) + abs(bInnerDis)) <= 0;
}

function calcDialogXSize(context) {
  let spaceCount = 0;
  let charCount = 0;

  for (let char of context) {
    if (char === ' ') {
      spaceCount++;
    } else {
      charCount++;
    }
  }
  
  return spaceCount*5+charCount*20+5;
}

function randomType() {
  let r = random(1);
  //console.log(r);
  if (r>= 0.75) {
    return "scoreUp"
  } else {
    return "damage"
  }
}

function keyPressed() {
  if(key === 's') {
    saveGif('game', 6);
  }
}