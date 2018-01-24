// #######################################################################################
// #################################  HOME PAGE   #######################################
// #######################################################################################

// get pages
const $gamePage = $('#gameContainer')
const $homePage = $('#homeContainer')
const $scorePage = $('#scoresContainer')
// get start button
const $play = $('#homeStartBtn')

const mainSong = new Audio('assets/frogger-forever.mp3')

// play mainsong
// mainSong.play()
mainSong.loop = false
// when play is clicked
$('#homeStartBtn').on('click', function () {
  mainSong.pause()
  $homePage.css('display', 'none')
  $gamePage.css('display', 'block')
    // mainSong.pause()
})

// when high score clicked
$('#scores').on('click', function () {
  mainSong.pause()
  $homePage.css('display', 'none')
  $gamePage.css('display', 'none')
  $scorePage.css('display', 'block')
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

// ----------------- SET SPRITE VARIBLES & IMAGES ---------------//
// LOAD ALL IMAGES IN ONE OBJECT
var Images = new function() {
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
      draw()
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

let x = 225
// let y = 520
let y = 230
let width = 25
let height = 25
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
    y -= 15
    up = false
  } else if (upPressed === false) {
    up = true
  }

  if (downPressed === true && down === true && y < 530) {
    y += 15
    down = false
  } else if (downPressed === false) {
    down = true
  }

  if (rightPressed === true && right === true && x < 515) {
    x += 15
    right = false
  } else if (rightPressed === false) {
    right = true
  }

  if (leftPressed === true && left === true && x > -15) {
    x -= 15
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
  frogObj = new ItemConstructor(Images.frog, 30, 30, 225, 520)
  truckObj = new ItemConstructor(Images.truck, 140, 45, 1.5, 225, 290)
  redcarObj = new ItemConstructor(Images.redcar, 50, 34, 3, 220, 400)
  racecarObj = new ItemConstructor(Images.racecar, 50, 50, 4, 280, 340)
  bulldozerObj = new ItemConstructor(Images.bulldozer, 50, 45, 3, 60, 440)
  yellowRacecarObj = new ItemConstructor(Images.yellowRacecar, 55, 48, 3, 100, 495)

  landObjsArr.push(truckObj, redcarObj, racecarObj, bulldozerObj, yellowRacecarObj)

  // initiate water objs
  tinyLogObj = new ItemConstructor(Images.log, 60, 30, 1.6, 500, 155)
  tinyLog2Obj = new ItemConstructor(Images.log, 60, 30, 1.6, 40, 155)
  medLogObj = new ItemConstructor(Images.log, 80, 30, 1.3, 0, 115)
  medLog2Obj = new ItemConstructor(Images.log, 80, 30, 1.3, 450, 115)
  bigLogObj = new ItemConstructor(Images.log, 100, 30, 1.6, 300, 50)
  bigLog2Obj = new ItemConstructor(Images.log, 100, 30, 1.6, 25, 50)
  twoTurtlesObj = new ItemConstructor(Images.twoTurtles, 75, 35, -1.4, 450, 80)
  twoTurtles2Obj = new ItemConstructor(Images.twoTurtles, 75, 35, -1.4, 50, 80)
  threeTurtlesObj = new ItemConstructor(Images.threeTurtles, 110, 26, -1.4, 120, 200)
  threeTurtles2Obj = new ItemConstructor(Images.threeTurtles, 110, 26, -1.4, 400, 200)

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
        y = 530
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
        y = 530
        x = 225
        break
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

function float () {
  if (y < 230) {
    floatingObjsArr.forEach(elem => {
      if (elem.x <= x + width &&
        elem.x + elem.width >= x &&
        elem.y + elem.height >= y &&
        elem.y <= y + height) {
          if (x < 515 && x > -15) {
            x += elem.speed
            console.log('detected!!!')
          }
          // y = 530
          // pixelCollision(elem)
      }
    })
  }
}

// ---------------------- PADS------------------------//
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
          y = 530
          x = 225
          console.log('onpad!!!')
      }
    })
  }

  padObjsArr.forEach(elem => {
    if(elem.onPad === true) {
      ctx.drawImage(Images.frog, elem.x, elem.y, width, height)
    }
  })
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
  // moveCars()
  moveLogsTurtles()
  onPad()
  float()
  carCollided()
  requestAnimationFrame(draw)
}

// SET VARIABLES
const $objects = $('.obj')
// lillys
const $lilly1 = $('#lilypad1')
const $lilly2 = $('#lilypad2')
const $lilly3 = $('#lilypad3')
const $lilly4 = $('#lilypad4')
const $lilly5 = $('#lilypad5')
// turtles
const $turtle1 = $('#turtle1')
const $turtle2 = $('#turtle2')
// logs
const $smallLog = $('#small-log')
const $medLog = $('#med-log')
const $longLog = $('#long-log')
// cars
// const $lateralObjs = $('.lateral-moving')
// const $truck = $('#truck')
// const $redcar = $('#redcar')
// const $racecar = $('#racecar')
// const $bulldozer = $('#bulldozer')
// const $yellowRacecar = $('#yellow-racecar')
// const $frog = $('#frog')

// Set initial position of all items
// function setPosition (obj, x, y, z) {
//   let translate = `translate3d(${x}, ${y}, ${z})`
//   obj.css({
//       '-ms-transform': translate,
//       '-webkit-transform': translate,
//       'transform': translate
//     })
// }

// // lillys
// setPosition($lilly1, '60px', '-15px', 0)
// setPosition($lilly2, '160px', '-15px', 0)
// setPosition($lilly3, '260px', '-15px', 0)
// setPosition($lilly4, '360px', '-15px', 0)
// setPosition($lilly5, '460px', '-15px', 0)

// // turtles
// setPosition($turtle1, '200px', '80px', 0)
// setPosition($turtle2, '360px', '200px', 0)

// // logs
// setPosition($smallLog, '200px', '165px', 0)
// setPosition($medLog, '360px', '130px', 0)
// setPosition($longLog, '50px', '40px', 0)

// setPosition($truck, '300px', '320px', 0)
// setPosition($redcar, '350px', '430px', 0)
// setPosition($racecar, '150px', '380px', 0)
// setPosition($bulldozer, '250px', '470px', 0)
// setPosition($yellowRacecar, '90px', '530px', 0)
// setPosition($frog, '245px', '600px', 0)

// /* Create a constructor that can encompass each item */
// let itemConstructor = function (obj) {
//   this.cssObj = obj[0]
//   this.cssWidth = parseInt($(this.cssObj).css('width'))
//   this.cssHeight = parseInt($(this.cssObj).css('height'))
//   this.xmin = parseInt($(this.cssObj).css('transform').split(',')[4])// returns position X - left side
//   this.posYmin = parseInt($(this.cssObj).css('transform').split(',')[5]) // returns position Y - top
//   this.posXmax = this.posXmin + this.cssWidth // right
//   this.posYmax = this.posYmin + this.cssHeight // bottom
//   this.speed = -5
//   this.updateSpeed = function () {
//       this.posXmax = this.posXmax + this.speed
//       this.posXmin = this.posXmin + this.speed
//     }
//   this.clientRect = function () {
//       return this.cssObj.getBoundingClientRect()
//     }
// }

// /* Instantiate moving frog */
// let movingFrog = new itemConstructor($frog)

// /* Global variable */
// let landObjsArr = [] // will contain all lateral moving items

// /* Define array of all lateral moving objects and instantiate them */
// $lateralObjs.each(function (index) {
//   landObjsArr.push(new itemConstructor($(this)))
// })

// $('#homeStartBtn').on('click', startGame)

// function startGame () {
// // diables continuous clicking of start button
//   $('#homeStartBtn').on('click', startGame).off()

// // set the interval for timer on page
//   let setIntID = setInterval(timer, 1000)

//   // let truckPosX = 300
//   // let redcarPosX = 300
//   // let racecarPosX = 150
//   let frogX = 245
//   let frogY = 600

//   // ----------------- ANIMATE CARS  ---------------//
//   function moveObj () {
//     // decriment or increment each item by entered numbers
//     // truckPosX -= 5
//     // redcarPosX -= 6
//     // racecarPosX += 6
//     //
//     landObjsArr.forEach(car => {
//       car.updateSpeed()
//       $(car.cssObj).css('transform', `translate3d(${car.posXmin}px, ${car.posYmin}px, 0px)`)
//       if (car.posXmin < -5) {
//         car.posXmin = 550
//       }
//       // call below function to check if there is collision
//       checkForCrashFrog()
//     })

//     // checkForCrashCar()

//     window.requestAnimationFrame(moveObj)
//   }

//   // ----------------- Count Down Timer  ---------------//
//   let timeDisplayed = $('#time')
//   let counter = 60

//   // collect score

//   // let sec = timeDisplayed.text(`${counter}`)
//   function timer () {
//     counter--
//     timeDisplayed.text(`${counter}`)
//       // check if time is  has run out, if so remove a life
//     if (counter === 0) {
//         dieSong.play()
//         lives--
//         $frogImages[lives].remove()
//         setPosition($frog, '245px', '600px', 0)
//         frogX = 245
//         frogY = 600
//         counter = 60
//       } else if (counter <= 20) {
//       timeDisplayed.css('color', 'red')
//     } else if (counter > 20) {
//       timeDisplayed.css('color', '#eff200')
//     }
//   }

//   // ----------------- Collision Detection ---------------//
//   let $frogImages = $('#frog-lives img')
//   let $frogLivesChildren = $('#frog-lives').children()
//   let lives = 2
//   const dieSong = new Audio('assets/frogger-squash.wav')

//   let $win = $('#win')
//   let $winTime = $('#time2')

//   let hasCollided = false
//   function checkForCrashFrog () {
//       landObjsArr.forEach(function (car) {
//         if (movingFrog.clientRect().x < car.clientRect().x + car.clientRect().width &&
//             movingFrog.clientRect().x + movingFrog.clientRect().width > car.clientRect().x &&
//             movingFrog.clientRect().y < car.clientRect().y + car.clientRect().height &&
//             movingFrog.clientRect().y + movingFrog.clientRect().height > car.clientRect().y) {
//             // collision detected!
//           if (frogY < 245 && lives !== 0) {
//                $win.css('visibility', 'visible')
//                $winTime.text(`${counter}`)
//                score += counter
//                $(document).on('keydown', (e) => { moveFrog(e) }).off()
//                setPosition($frog, '245px', '600px', 0)
//                frogX = 245
//                frogY = 600

//                setTimeout(function () {
//                   counter = 60
//                   $win.css('visibility', 'hidden')
//                   $(document).on('keydown', (e) => { moveFrog(e) })
//                 }, 800)
//              }else {
//                $frog.children('img').attr('src', ('images/icons8-Poison-96.png'))
//                dieSong.play()
//                setTimeout(function () {
//               $frog.children('img').attr('src', ('images/frog.png'))
//                 // remove a frog life
//               hasCollided = true
//               $frogImages[lives].remove()

//               setPosition($frog, '245px', '600px', 0)
//               frogX = 245
//               frogY = 600
//             }, 600)
//                if (hasCollided === true) {
//                lives--
//              }
//                hasCollided = false
//              }// end of if statement
//         }
//       })// end of forEach

//       // ----------------- GAME OVER CODE ---------------//
//       let $enterNameMsg = $('#enterName')

//       if (lives == 0) {
//         $enterNameMsg.css('visibility', 'visible')
//         $(document).on('keydown', (e) => { moveFrog(e) }).off()
//         clearInterval(setIntID)
//       }
//     }// end of checkForCrashFrog

//   // -------------------   Move Frog   ---------------//
//   let $score = $('#score')
//   let score = 0

//   function moveFrog (event) {
//          // when arrow keys are pressed move as advised
//       switch (event.keyCode) {
//         case 37:
//           // make sure frog is within screen
//           if (frogX <= 4) {
//             event.preventDefault()
//           } else{
//             frogX -= 30 
// }
//           movingFrog.posXmin = frogX
//           movingFrog.posXmax = movingFrog.posXmin + movingFrog.cssWidth
//           // console.log(frogX)
//           $frog.css('transform', `translate3d(${frogX}px, ${frogY}px, 0px)`)  // left
//           break
//         case 38:
//           if (frogY <= 0) {
//             event.preventDefault()
//           }else {
//             frogY -= 30 
// }
//           score += 10
//           $score.text(`${score}`)
//           movingFrog.posYmin = frogY
//           movingFrog.posYmax = movingFrog.posYmin + movingFrog.cssHeight
//           $frog.css('transform', `translate3d(${frogX}px, ${frogY}px, 0px)`) // up
//           break
//         case 39:
//           if (frogX >= 500) {
//             event.preventDefault()
//           }else {
//             frogX += 30 
// }
//           movingFrog.posXmin = frogX
//           movingFrog.posXmax = movingFrog.posXmin + movingFrog.cssWidth
//           $frog.css('transform', `translate3d(${frogX}px, ${frogY}px, 0px)`)  // right
//           break
//         case 40:
//           if (frogY >= 600) {
//             event.preventDefault()
//           } else{
//             frogY += 30
//  }
//           movingFrog.posYmin = frogY
//           movingFrog.posYmax = movingFrog.posYmin + movingFrog.cssHeight
//           $frog.css('transform', `translate3d(${frogX}px, ${frogY}px, 0px)`) // down
//           break
//       } // keyCode end
//         // ----------------- CONDITIONS IN WATER ---------------//
//     } // moveFrog end
//   $(document).on('keydown', (e) => { moveFrog(e) })
    
//   window.requestAnimationFrame(moveObj)
// }
