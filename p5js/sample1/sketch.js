let prevX = 0;
let prevY = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  // 마우스 속도 계산
  // dist( ) 함수는 2 점 사이의 거리를 구해준다.
  let diam = dist(mouseX, mouseY, prevX, prevY);

  // 원 그리기
  fill(100, 150, 255);
  noStroke();
  ellipse(mouseX, mouseY, diam, diam);

  // 이전 마우스 위치 업데이트
  prevX = mouseX;
  prevY = mouseY;
}