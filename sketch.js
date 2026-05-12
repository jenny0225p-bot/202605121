let faceMesh;
let video;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipHorizontal: false };

function preload() {
  // 初始化 ml5 faceMesh 模型
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  // 1. 產生全螢幕畫布
  createCanvas(windowWidth, windowHeight);

  // 2. 擷取攝影機影像內容
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // 開始臉部辨識偵測
  faceMesh.detectStart(video, gotFaces);
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  // 3. 設定畫布背景顏色為 e7c6ff
  background('#e7c6ff');

  // 4. 置中上方顯示文字
  fill(0);
  noStroke();
  textAlign(CENTER, TOP);
  textSize(32);
  text("414730217羅紫芸", width / 2, 20);
  textSize(24);
  text("作品為影像辨識_耳環臉譜", width / 2, 65);

  // 5. 計算影像顯示寬高 (畫布寬高的 50%)
  let w = width * 0.5;
  let h = height * 0.5;
  let x = (width - w) / 2;
  let y = (height - h) / 2;

  // 6. 顯示影像並做左右顛倒處理
  push();
  translate(x + w, y); // 移動到顯示區域的右側邊界
  scale(-1, 1);        // 水平翻轉
  image(video, 0, 0, w, h);

  // 7. 辨識耳垂並畫出黃色圓圈耳環
  if (faces.length > 0) {
    let face = faces[0];
    // MediaPipe 索引點：172 為右耳垂底端, 397 為左耳垂底端
    let earPoints = [face.keypoints[172], face.keypoints[397]];
    
    fill(255, 255, 0); // 黃色
    noStroke();
    
    for (let pt of earPoints) {
      if (pt) {
        // 將座標從原始影片大小映射到顯示大小 (w, h)
        let px = map(pt.x, 0, video.width, 0, w);
        let py = map(pt.y, 0, video.height, 0, h);
        
        // 耳垂位置往下繪製三個圓圈
        for (let i = 1; i <= 3; i++) {
          circle(px, py + (i * 20), 10);
        }
      }
    }
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}