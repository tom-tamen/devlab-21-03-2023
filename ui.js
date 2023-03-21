function modelReady() {
  // select('#status').html('Model Loaded');
}

function draw() {
  translate(canvas.width, 0);
  scale(-1, 1)
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();
  drawWorldLines()
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
// Loop through all the poses detected
for (let i = 0; i < poses.length; i++) {
  // For each pose detected, loop through all the keypoints
  let pose = poses[i].pose;
  for (let j = 0; j < pose.keypoints.length; j++) {
    // A keypoint is an object describing a body part (like rightArm or leftShoulder)
    let keypoint = pose.keypoints[j];
    // Only draw an ellipse is the pose probability is bigger than 0.2
    if (keypoint.score > 0.2) {
      fill(255, 0, 0);
      noStroke();
      ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
    }
  }
}
}

// A function to draw the skeletons
function drawSkeleton() {
// Loop through all the skeletons detected
for (let i = 0; i < poses.length; i++) {
  let skeleton = poses[i].skeleton;
  // For every skeleton, loop through all body connections
  for (let j = 0; j < skeleton.length; j++) {
    let partA = skeleton[j][0];
    let partB = skeleton[j][1];
    stroke(255, 0, 0);
    line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
  }
}
}

function drawWorldLines() {
  stroke(0, 0, 255);
  strokeWeight(4)
  line(camEl.offsetWidth / 3, 0, camEl.offsetWidth / 3, camEl.offsetHeight);
  line(camEl.offsetWidth / 1.5, 0, camEl.offsetWidth / 1.5, camEl.offsetHeight);
  strokeWeight(1)
}

function resizeCanvas() {
  //console.log('resize')
  canvas.size(camEl.offsetWidth, camEl.offsetHeight);
  video.size(camEl.offsetWidth, camEl.offsetHeight);
  // poseNet = ml5.poseNet(video, 'single' ,modelReady);
}

function switchCams() {
  //console.log('switch')
  let mainPov = document.querySelector('.mainPov')
  let secondPov = document.querySelector('.secondPov')
  let tempPoveSize = {
    offsetWidth: secondPov.offsetWidth,
    offsetHeight: secondPov.offsetHeight
  }
  mainPov.classList.remove('mainPov')
  mainPov.classList.add('secondPov')

  secondPov.classList.remove('secondPov')
  secondPov.classList.add('mainPov')


  if(mainPov.id === "cam") {
    canvas.size(tempPoveSize.offsetWidth - 8, tempPoveSize.offsetWidth * 0.75);
    video.size(tempPoveSize.offsetWidth - 8, tempPoveSize.offsetWidth * 0.75);
  } else {
    canvas.size(camEl.offsetWidth, camEl.offsetHeight);
    video.size(camEl.offsetWidth, camEl.offsetHeight);
  }
  }

  document.querySelector('.toggleBoard').addEventListener('click', () => {
  document.querySelector('main').classList.toggle('board')

  canvas.size(camEl.offsetWidth, camEl.offsetHeight);
  video.size(camEl.offsetWidth, camEl.offsetHeight);
})

window.addEventListener('resize', resizeCanvas)
window.addEventListener('keypress', (e) => {
  if(e.key !== 'p') return
  isGameStarted = true
  console.log('GAME START')
})
// document.querySelectorAll('.cams > div').forEach(cam => {
//   cam.addEventListener('click', switchCams)
// })

let isGameStarted = false;
let playerPosition = 'mid';
let previousPlayerPosition = 'mid';
let canvas;
let video;
let poseNet;
let poses = [];
let camEl = document.querySelector('#cam')

function setup() {
  canvas = createCanvas(camEl.offsetWidth, camEl.offsetHeight);
  canvas.parent('#cam')
  video = createCapture(VIDEO);
  //console.log(video)
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, 'single' ,modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
    // console.log(poses)
    
    if(!isGameStarted) return
    // On annule le mouvement d'avant
    if(playerPosition === 'left') window.dispatchEvent(new KeyboardEvent('keyup', {'key': 'ArrowLeft'}))
    else if(playerPosition === 'right') window.dispatchEvent(new KeyboardEvent('keyup', {'key': 'ArrowRight'}))
    else if(playerPosition === 'mid') {
      if(previousPlayerPosition === 'left') window.dispatchEvent(new KeyboardEvent('keyup', {'key': 'ArrowRight'}))
      if(previousPlayerPosition === 'right') window.dispatchEvent(new KeyboardEvent('keyup', {'key': 'ArrowLeft'}))
    }
    if(poses[0].pose.nose.x > camEl.offsetWidth / 1.5) {
      //console.log('left')
      if(playerPosition !== 'left') window.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowLeft'}))
      playerPosition = 'left'
    } else if(poses[0].pose.nose.x > camEl.offsetWidth /3) {
      //console.log('mid')
      if(playerPosition == 'left') window.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowRight'}))
      if(playerPosition == 'right') window.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowLeft'}))
      previousPlayerPosition = playerPosition
      playerPosition = 'mid'
    } else {
      //console.log('right')
      if(playerPosition !== 'right') window.dispatchEvent(new KeyboardEvent('keydown', {'key': 'ArrowRight'}))
      playerPosition = 'right'
    }
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

