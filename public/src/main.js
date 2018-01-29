// #######################################################################################
// #################################  HOME PAGE   #######################################
// #######################################################################################

// get pages
const $gamePage = $('#gameContainer')
const $homePage = $('#homeContainer')
const $scorePage = $('#scoresContainer')
const $disclaimerPage = $('#disclaimerContainer')
// get start button
const $play = $('#homeStartBtn')

const mainSong = new Audio('assets/frogger-forever.mp3')
let startTimer

// play mainsong
// mainSong.play()
mainSong.loop = false
// when play is clicked
$('#homeStartBtn, #newGameBtn, #yes').on('click', function () {
  mainSong.pause()
  $homePage.css('display', 'none')
  $scorePage.css('display', 'none')
  $disclaimerPage.css('display', 'none')
  $gamePage.css('display', 'block')
  startTimer = setInterval(function(){ timer() }, 1000)
    // mainSong.pause()
})

// when high score clicked
$('#scores').on('click', function () {
  mainSong.pause()
  $homePage.css('display', 'none')
  $gamePage.css('display', 'none')
  $scorePage.css('display', 'block')
})

// when disclaimer clicked
$('#disclaimer').on('click', function () {
  mainSong.pause()
  $homePage.css('display', 'none')
  $gamePage.css('display', 'none')
  $disclaimerPage.css('display', 'block')
  $scorePage.css('display', 'none')
})

// when back clicked
$('#backBtn, #no').on('click', function () {
  location.reload()
})
// #######################################################################################
// #################################  GAME PAGE   #####################################
// #######################################################################################

// code for collision was created with references to:
// https://magently.com/blog/detecting-a-jquery-collision-part-i/
// https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
// https://www.safaribooksonline.com/library/view/html5-canvas-2nd/9781449335847/ch04s10s03.html
// and Jay
// and super special thanks to Taka!!!!

// SET CANVAS
const canvas = document.getElementById('game-wrapper')
const ctx = canvas.getContext('2d')
let play
let timeDisplayed = document.getElementById('time')
let counter = 60

// ----------------- SET SPRITE VARIBLES & IMAGES ---------------//
// LOAD ALL IMAGES IN ONE OBJECT
let Images = new function() {
  // IMAGES
  this.frog = new Image()
  this.truck = new Image()
  this.redcar = new Image()
  this.racecar = new Image()
  this.bulldozer = new Image()
  this.yellowRacecar = new Image()
  this.log = new Image()
  this.pad = new Image()
  this.twoTurtles = new Image()
  this.threeTurtles = new Image()

	// Ensure all images have loaded before starting the game
  var numImages = 9
  var numLoaded = 0
  
  function imageLoaded () {
    numLoaded++
    if (numLoaded === numImages) {
      console.log(numLoaded)
      postionObjs()
      play = true
      draw()
      // let startTimer = setInterval(function(){ timer() }, 1000)
    }
  }
  this.frog.onload = function () {
    imageLoaded()
  }
  this.truck.onload = function () {
    imageLoaded()
  }
  this.redcar.onload = function () {
    imageLoaded()
  }
  this.racecar.onload = function () {
    imageLoaded()
  }
  this.bulldozer.onload = function () {
    imageLoaded()
  }
  this.yellowRacecar.onload = function () {
    imageLoaded()
  }
  this.log.onload = function () {
    imageLoaded()
  }
  this.twoTurtles.onload = function () {
    imageLoaded()
  }
  this.threeTurtles.onload = function () {
    imageLoaded()
  }
  this.pad.onload = function () {
    imageLoaded()
  }

	// Set images src;
  this.frog.src = '../images/frog.png'
  this.truck.src = '../images/truck.png'
  this.redcar.src = '../images/redcar.png'
  this.racecar.src = '../images/racecar.png'
  this.bulldozer.src = '../images/bulldozer.png'
  this.yellowRacecar.src = '../images/yellow-racecar.png'
  this.log.src = '../images/brown-log.png'
  this.twoTurtles.src = '../images/turtles2.png'
  this.threeTurtles.src = '../images/turtles3.png'
  this.pad.src = '../images/lilypad.png'
}

// frog position and size
let x = 225
// let y = 520
let y = 560
let width = 25
let height = 25

let lives = 3
let lostLives = 0
let frogImages = document.querySelectorAll('.frogs')
let score = 0

// ---------------------------- MOVE FROG ----------------------//
// KEY PRESS
// key monitor
let rightPressed = false
let leftPressed = false
let upPressed = false
let downPressed = false
let right = true
let left = true
let up = true
let down = true

// event listener
document.addEventListener('keyup', keyUpHandler, false)
document.addEventListener('keydown', keyDownHandler, false)

// frog key functions
function keyUpHandler (e) {
  if (e.keyCode === 39) { rightPressed = true }
  if (e.keyCode === 37) { leftPressed = true }
  if (e.keyCode === 38) { upPressed = true }
  if (e.keyCode === 40) { downPressed = true }
}

function keyDownHandler (e) {
  if (e.keyCode === 39) { rightPressed = false }
  if (e.keyCode === 37) { leftPressed = false }
  if (e.keyCode === 38) { upPressed = false }
  if (e.keyCode === 40) { downPressed = false }
}

function drawFrog () {
  ctx.drawImage(Images.frog, x, y, width, height)
  frogObj.imageData = ctx.getImageData(x, y, width, height)
}

function moveFrog () {
  if (upPressed === true && up === true && y > -10) {
    // ctx.rotate(.5)
    y -= 10
    score += 10
    scoreValue.value = `${score}`
    scoreText.innerText = `${score}`
    up = false
    console.log(score)
  } else if (upPressed === false) {
    up = true
  }

  if (downPressed === true && down === true && y < 560) {
    y += 10
    score -= 5
    scoreValue.value = `${score}`
    scoreText.innerText = `${score}`
    down = false
  } else if (downPressed === false) {
    down = true
  }

  if (rightPressed === true && right === true && x < 515) {
    x += 10
    right = false
  } else if (rightPressed === false) {
    right = true
  }

  if (leftPressed === true && left === true && x > -15) {
    x -= 10
    left = false
  } else if (leftPressed === false) {
    left = true
  }
}

// ---------------------- MOVE CARS------------------------//
// array of vehicle and water objects
let landObjsArr = []
let floatingObjsArr = []
let padObjsArr = []

// constructor to easily draw vehicles & other objs
let ItemConstructor = function (obj, width, height, speed, x, y, onPad) {
  this.obj = obj
  this.width = width
  this.height = height
  this.x = x
  this.y = y
  this.speed = speed
  this.imageData = ctx.getImageData(this.x, this.y, this.width, this.height)
  this.onPad = false
}

// initiate constructor varaibles
let frogObj
let truckObj
let redcarObj
let racecarObj
let bulldozerObj
let yellowRacecarObj
let tinyLogObj
let tinyLog2Obj
let medLogObj
let medLog2Obj
let bigLogObj
let bigLog2Obj
let twoTurtlesObj
let twoTurtles2Obj
let threeTurtlesObj
let threeTurtles2Obj
let padObj
let pad2Obj
let pad3Obj
let pad4Obj
let pad5Obj

function postionObjs () {
  // initate land objects
  frogObj = new ItemConstructor(Images.frog, 30, 30, 225, 560)
  truckObj = new ItemConstructor(Images.truck, 140, 45, 1.5, 225, 290)
  redcarObj = new ItemConstructor(Images.redcar, 50, 34, 3, 220, 400)
  racecarObj = new ItemConstructor(Images.racecar, 50, 50, 4, 280, 340)
  bulldozerObj = new ItemConstructor(Images.bulldozer, 50, 45, 3, 60, 440)
  yellowRacecarObj = new ItemConstructor(Images.yellowRacecar, 55, 48, 3, 100, 495)

  landObjsArr.push(truckObj, redcarObj, racecarObj, bulldozerObj, yellowRacecarObj)

  // initiate water objs
  tinyLogObj = new ItemConstructor(Images.log, 60, 35, 1.6, 500, 195)
  tinyLog2Obj = new ItemConstructor(Images.log, 60, 35, 1.6, 40, 195)
  medLogObj = new ItemConstructor(Images.log, 80, 35, 1.3, 0, 115)
  medLog2Obj = new ItemConstructor(Images.log, 80, 35, 1.3, 450, 115)
  bigLogObj = new ItemConstructor(Images.log, 100, 35, 1.6, 300, 50)
  bigLog2Obj = new ItemConstructor(Images.log, 100, 35, 1.6, 25, 50)
  twoTurtlesObj = new ItemConstructor(Images.twoTurtles, 75, 35, -1.4, 450, 80)
  twoTurtles2Obj = new ItemConstructor(Images.twoTurtles, 75, 35, -1.4, 50, 80)
  threeTurtlesObj = new ItemConstructor(Images.threeTurtles, 110, 35, -1.4, 120, 155)
  threeTurtles2Obj = new ItemConstructor(Images.threeTurtles, 110, 35, -1.4, 400, 155)

  floatingObjsArr.push(tinyLogObj, medLogObj, bigLogObj, twoTurtlesObj, tinyLog2Obj, medLog2Obj, bigLog2Obj,threeTurtlesObj, twoTurtles2Obj, threeTurtles2Obj)

  // initiate pad objs
  padObj = new ItemConstructor(Images.pad, 35, 30, 1.7, 30, 0)
  pad2Obj = new ItemConstructor(Images.pad, 35, 30, 1.7, 140, 0)
  pad3Obj = new ItemConstructor(Images.pad, 35, 30, 1.7, 250, 0)
  pad4Obj = new ItemConstructor(Images.pad, 35, 30, 1.7, 360, 0)
  pad5Obj = new ItemConstructor(Images.pad, 35, 30, 1.7, 470, 0)

  padObjsArr.push(padObj, pad2Obj, pad3Obj, pad4Obj, pad5Obj)
  console.log(pad5Obj.onPad)
}

function drawCars () {
  // draw each vehicle in the lateral objs array
  landObjsArr.forEach(elem => {
    ctx.drawImage(elem.obj, elem.x, elem.y, elem.width, elem.height)
    elem.imageData = ctx.getImageData(elem.x, elem.y, elem.width, elem.height)
  })
}

function moveCars () {
  // truck
  if (truckObj.x > -100) {
    truckObj.x -= truckObj.speed
  } else {
    truckObj.x = 700
  }
  // redcar
  if (redcarObj.x > -100) {
    redcarObj.x -= redcarObj.speed
  } else {
    redcarObj.x = 700
  }
  // yellowcar
  if (yellowRacecarObj.x > -100) {
    yellowRacecarObj.x -= yellowRacecarObj.speed
  } else {
    yellowRacecarObj.x = 700
  }
  // bulldozer
  if (bulldozerObj.x < canvas.width + 100) {
    bulldozerObj.x += bulldozerObj.speed
  } else {
    bulldozerObj.x = -200
  }
  // racecar
  if (racecarObj.x < canvas.width + 100) {
    racecarObj.x += racecarObj.speed
  } else {
    racecarObj.x = -100
  }
}

// --------------------- COLLISION DETECTION---------------------//
function carCollided () {
  landObjsArr.forEach(elem => {
    if (elem.x <= x + width &&
      elem.x + elem.width >= x &&
      elem.y + elem.height >= y &&
      elem.y <= y + height) {
        // console.log('detected!!!')
        removeLife()
        lives--
        // pixelCollision(elem)
    }
  })
}

function pixelCollision (elem) {
  // get area of collision intersection
  var xMin = Math.max(x, elem.x)
  var yMin = Math.max(y, elem.y)
  var xMax = Math.min(x + width, elem.x + elem.width)
  var yMax = Math.min(y + height, elem.y + elem.height)

  for (var pixelX = xMin; pixelX < xMax; pixelX++) {
    for (var pixelY = yMin; pixelY < yMax; pixelY++) {
      var frogpixel = ((pixelX - x) + (pixelY - y) * width) * 4 + 3
      var elempixel = ((pixelX - elem.x) + (pixelY - elem.y) * elem.width) * 4 + 3
      if ((frogObj.imageData.data[ frogpixel ] !== 0) &&
        (elem.imageData.data[ elempixel ] !== 0)) {
        console.log("pixel collision")
      }
    }
  }
}

// ---------------------- MOVE LOGS & TURTLES------------------------//

function drawLogsTurtles () {
  floatingObjsArr.forEach(elem => {
    ctx.drawImage(elem.obj, elem.x, elem.y, elem.width, elem.height)
    elem.imageData = ctx.getImageData(elem.x, elem.y, elem.width, elem.height)
  })
}

function moveLogsTurtles () {
  // tinylog
  if (tinyLogObj.x < canvas.width + 100) {
    tinyLogObj.x += tinyLogObj.speed
    } else {
      tinyLogObj.x = -100
  }
  if (tinyLog2Obj.x < canvas.width + 100) {
    tinyLog2Obj.x += tinyLog2Obj.speed
    } else {
      tinyLog2Obj.x = -100
  }
  // medlog
  if (medLogObj.x < canvas.width + 100) {
      medLogObj.x += medLogObj.speed
    } else {
      medLogObj.x = -100
  }
  if (medLog2Obj.x < canvas.width + 100) {
      medLog2Obj.x += medLog2Obj.speed
    } else {
      medLog2Obj.x = -100
  }
  // biglog
  if (bigLogObj.x < canvas.width + 100) {
      bigLogObj.x += bigLogObj.speed
    } else {
      bigLogObj.x = -100
  }
  if (bigLog2Obj.x < canvas.width + 100) {
      bigLog2Obj.x += bigLog2Obj.speed
    } else {
      bigLog2Obj.x = -100
  }
  // turtles
  if (twoTurtlesObj.x > -100) {
      twoTurtlesObj.x += twoTurtlesObj.speed
    } else {
      twoTurtlesObj.x = 700
  }
  if (twoTurtles2Obj.x > -100) {
      twoTurtles2Obj.x += twoTurtles2Obj.speed
    } else {
      twoTurtles2Obj.x = 700
  }
  if (threeTurtlesObj.x > -100) {
      threeTurtlesObj.x += threeTurtlesObj.speed
    } else {
      threeTurtlesObj.x = 700
  }
  if (threeTurtles2Obj.x > -100) {
      threeTurtles2Obj.x += threeTurtles2Obj.speed
    } else {
      threeTurtles2Obj.x = 700
  }
}
let ok
function float () {
  if (y < 220) {
    floatingObjsArr.forEach(elem => {
      if (elem.x <= x + width &&
        elem.x + elem.width >= x &&
        elem.y + elem.height >= y &&
        elem.y <= y + height) {
          if (x < canvas.width - 10 && x > 0) {
            x += elem.speed
            ok = true
            // waterPixelCollision(elem)
            console.log('detected!!!')
          }
      }else{console.log('in water') }
    })
  }
  
}
function check () {
  ok = false
  if(ok === false) {
    y = 560
  }
}

function waterPixelCollision (elem) {
  // get area of collision intersection
  var xMin = Math.max(x, elem.x)
  var yMin = Math.max(y, elem.y)
  var xMax = Math.min(x + width, elem.x + elem.width)
  var yMax = Math.min(y + height, elem.y + elem.height)

  for (var pixelX = xMin; pixelX < xMax; pixelX++) {
    for (var pixelY = yMin; pixelY < yMax; pixelY++) {
      var frogpixel = ((pixelX - x) + (pixelY - y) * width) * 4 + 3
      var elempixel = ((pixelX - elem.x) + (pixelY - elem.y) * elem.width) * 4 + 3
      if ((frogObj.imageData.data[ frogpixel ] !== 0) &&
        (elem.imageData.data[ elempixel ] !== 0)) {
          x += elem.speed
        console.log("pixel collision")
      }
    }
  }
}

// ---------------------- PADS------------------------//
let winScenario

function drawPads () {
  padObjsArr.forEach(elem => {
    ctx.drawImage(elem.obj, elem.x, elem.y, elem.width, elem.height)
    elem.imageData = ctx.getImageData(elem.x, elem.y, elem.width, elem.height)
  })
}

function onPad () {
  if (y < 230) {
    padObjsArr.forEach(elem => {
      if (elem.x <= x + width &&
        elem.x + elem.width >= x &&
        elem.y + elem.height >= y &&
        elem.y <= y + height) {
          elem.onPad = true
          y = 560
          x = 230
          console.log('onpad!!!')
      }
    })
  }

  padObjsArr.forEach(elem => {
    if(elem.onPad === true) {
      ctx.drawImage(Images.frog, elem.x, elem.y, width, height)
    }
  })

  if(padObj.onPad &&
    pad2Obj.onPad &&
    pad3Obj.onPad &&
    pad4Obj.onPad &&
    pad5Obj.onPad) {
      winScenario = true
    }
}

// -------------------------------- GAME LOGIC -------------------------------------//

// ----------- Remove Life  ----------//
function removeLife (){
  Images.frog.src = '../images/icons8-Poison-96.png'
  frogImages[lives - 1].remove()
  setTimeout(function(){
    Images.frog.src = '../images/frog.png'
  }, 700)
  x = 225
  y = 560
  counter = 60
}

// ----------- Count Down Timer  --------//
function timer () {
  counter--
  timeDisplayed.innerText = `${counter}`
  // check if time is  has run out, if so remove a life
  if (counter === 0) {
    // dieSong.play()
    removeLife()
    lives--
    counter = 60
    timeDisplayed.style.color = '#eff200'
  } else if (counter <= 20) {
    timeDisplayed.style.color = 'red'
  } 
}

// ----------- GAME OVER ---------//
let enterNameMsg = document.getElementById('enterName')
function gameOver () {
  if(lives < 1) {
    console.log('yoooo')
    enterNameMsg.style.display = 'block'
    clearInterval(startTimer)
    play = false
  }
}
// ------------ WIN -------------//
let scoreValue = document.getElementById('yourScore')
let scoreText = document.getElementById('score')

function scorePonts() {
  if (upPressed) {
    score += 10
  } 
  scoreValue.value = `${score}`
  scoreText.innerText = `${score}`
}

// REQUEST ANIMATION FRAME
function draw () {
  // stop images from repeating as they move
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawPads()
  drawLogsTurtles()
  drawFrog()
  moveFrog()
  drawCars()
  moveCars()
  moveLogsTurtles()
  onPad()
  float()
  carCollided()
  gameOver()
  if (play) {
    requestAnimationFrame(draw)
  }
}


// ----------------- POST SCORE ---------------//


function attachUsersToPage(data) {
  const scorePage = document.getElementById('score-wrapper')
  let number = 1
  data.users.forEach((user) => {
    const userDiv = document.createElement('div');
    userDiv.classList.add('user');
    
    userDiv.innerHTML = `<h3>${number++}. ${user.name}</h3>`;
    userDiv.innerHTML += `<p class='score'>${user.score}</p>`;
    scorePage.appendChild(userDiv);
  })
}


function fetchUsers() {
  fetch('/users').then(res => res.json()).then(jsonRes => {
    attachUsersToPage(jsonRes.data);
  })
}

document.addEventListener('DOMContentLoaded', fetchUsers);