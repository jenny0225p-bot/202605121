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
  text("414730217羅紫芸", width / 2, 30);
  textSize(24);
  text("作品為影像辨識_耳環臉譜", width / 2, 80);

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
    // 使用更穩定的耳垂位置索引：215(右), 435(左)
    let earPoints = [face.keypoints[215], face.keypoints[435]];
    
    fill(255, 255, 0); // 黃色
    noStroke();
    
    for (let pt of earPoints) {
      if (pt) {
        // 使用 video.width/height 確保映射精確
        let px = map(pt.x, 0, video.width, 0, w);
        let py = map(pt.y, 0, video.height, 0, h);
        
        // 根據影像高度動態計算耳環間距與大小，避免比例失真
        let spacing = h * 0.04; 
        let diameter = h * 0.02;

        for (let i = 1; i <= 3; i++) {
          circle(px, py + (i * spacing), diameter);
        }
      }
    }
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}