// #######################################################################################
// #################################  HOME PAGE   #######################################
// #######################################################################################

//get pages
const $gamePage = $('#gameContainer');
const $homePage = $('#homeContainer');
//get start button
const $play = $('#homeStartBtn');

$('#homeStartBtn').on('click', function(){
    $homePage.hide();
    $gamePage.css("visibility", "visible");
})




//#######################################################################################
//#################################  GAME PAGE   #####################################
//#######################################################################################

//code for collision was created with references to:
//https://magently.com/blog/detecting-a-jquery-collision-part-i/
//https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
//and Jay
//and super special thanks to Taka!!!!



//----------------- Setup Request Animation Frame  ---------------///
//request animation done with help from https://www.youtube.com/watch?v=rNsC1VI9388&t=136s

window.requestAnimationFrame = window.requestAnimationFrame ||
                               window.mozRequestAnimationFrame ||
                               window.webkitRequestAnimationFrame ||
                               window.msRequestAnimationFrame;


// SET VARIABLES
const $startBtn = $('#startBtn')
const $objects = $('.obj');
//lillys
const $lilly1 = $('#lilypad1');
const $lilly2 = $('#lilypad2');
const $lilly3 = $('#lilypad3');
const $lilly4 = $('#lilypad4');
const $lilly5 = $('#lilypad5');
//turtles
const $turtle1 = $('#turtle1');
const $turtle2 = $('#turtle2');
//logs
const $smallLog = $('#small-log');
const $medLog = $('#med-log');
const $longLog = $('#long-log');
//cars
const $lateralObjs = $('.lateral-moving');
const $truck = $('#truck');
const $redcar = $('#redcar');
const $racecar = $('#racecar');
const $bulldozer = $('#bulldozer');
const $yellowRacecar = $('#yellow-racecar');
const $frog = $('#frog');

//Set initial position of all items
function setPosition(obj, x, y, z) {
    let translate = `translate3d(${x}, ${y}, ${z})`;
    obj.css({
        "-ms-transform" : translate,
        "-webkit-transform" : translate,
        "transform" : translate
    });
}

//lillys
setPosition($lilly1, "60px", "-15px", 0);
setPosition($lilly2, "160px", "-15px", 0);
setPosition($lilly3, "260px", "-15px", 0);
setPosition($lilly4, "360px", "-15px", 0);
setPosition($lilly5, "460px", "-15px", 0);

//turtles
setPosition($turtle1, "200px", "80px", 0);
setPosition($turtle2, "360px", "200px", 0);

//logs
setPosition($smallLog, "200px", "165px", 0);
setPosition($medLog, "360px", "130px", 0);
setPosition($longLog, "50px", "40px", 0);

setPosition($truck, "300px", "320px", 0);
setPosition($redcar, "350px", "430px", 0);
setPosition($racecar, "150px", "380px", 0);
setPosition($bulldozer, "250px", "470px", 0);
setPosition($yellowRacecar, "90px", "530px", 0);
setPosition($frog, "245px", "600px", 0);



/* Create a constructor that can encompass each item */
let itemConstructor = function(obj) {
    console.log('the thing passed into construct ',obj);
    this.cssObj = obj[0];
    console.log(this.cssObj)
    this.cssWidth = parseInt($(this.cssObj).css("width"));
    this.cssHeight = parseInt($(this.cssObj).css("height"));
    this.posXmin = parseInt($(this.cssObj).css('transform').split(',')[4])// returns position X - left side
    this.posYmin = parseInt($(this.cssObj).css('transform').split(',')[5]); // returns position Y - top
    this.posXmax = this.posXmin + this.cssWidth; // right
    this.posYmax = this.posYmin + this.cssHeight; // bottom
    this.speed = -2;
    this.updateSpeed = function () {
      this.posXmax = this.posXmax + this.speed;
      this.posXmin = this.posXmin + this.speed;
    }
    this.clientRect = function() {
        return this.cssObj.getBoundingClientRect();
    }
}


/* Instantiate moving frog */
let movingFrog = new itemConstructor($frog);

/* Global variable */
let lateralObjsArray = []; // will contain all lateral moving items

/* Define array of all lateral moving objects and instantiate them */
$lateralObjs.each(function(index) {
    lateralObjsArray.push(new itemConstructor($(this)));
});

$('#startBtn').on('click', startGame);


function startGame(){
//diables continuous clicking of start button
$('#startBtn').on('click', startGame).off();

//set the interval for timer on page
let setIntID = setInterval(timer,1000);



  // let truckPosX = 300;
  // let redcarPosX = 300;
  // let racecarPosX = 150;
  let frogX = 245;
  let frogY = 600;


  //----------------- ANIMATE CARS  ---------------//
  function moveObj(){
    //decriment or increment each item by entered numbers
    // truckPosX -= 5;
    // redcarPosX -= 6;
    // racecarPosX += 6;
    //
    lateralObjsArray.forEach(car => {

      car.updateSpeed();
      $(car.cssObj).css('transform',`translate3d(${car.posXmin}px, ${car.posYmin}px, 0px)`);
      if(car.posXmin < -5){
        car.posXmin = 550
      };
      //call below function to check if there is collision
      checkForCrashFrog();
    })

    // checkForCrashCar();

    window.requestAnimationFrame(moveObj);

  }

  //----------------- Count Down Timer  ---------------//
  let timeDisplayed = $('#time');
  let counter = 60;

  //collect score

  // let sec = timeDisplayed.text(`${counter}`);
  function timer(){
      counter--;
      timeDisplayed.text(`${counter}`);
      //check if time is  has run out, if so remove a life
      if(counter === 0){
        lives--;
        $frogImages[lives].remove();
        setPosition($frog, "245px", "600px", 0);
        frogX = 245;
        frogY = 600;
        counter = 60;
    }else if(counter <=20){
        timeDisplayed.css('color', 'red');
    }else if (counter > 20) {
        timeDisplayed.css('color', '#eff200');
    }
  }


  //----------------- Collision Detection ---------------//
  let $frogImages = $('#frog-lives img');
  let $frogLivesChildren = $('#frog-lives').children();
  let  lives = 2;
  let hasCollided = false;
    function checkForCrashFrog(){
      lateralObjsArray.forEach(function(car){
        if (movingFrog.clientRect().x < car.clientRect().x + car.clientRect().width &&
            movingFrog.clientRect().x + movingFrog.clientRect().width > car.clientRect().x &&
            movingFrog.clientRect().y < car.clientRect().y + car.clientRect().height &&
            movingFrog.clientRect().y + movingFrog.clientRect().height > car.clientRect().y ) {

            // collision detected!
             if(frogY < 250){
                // movingFrog.clientRect().x  = car.clientRect().x;
                // movingFrog.clientRect().y = car.clientRect().y;

                movingFrog.updateSpeed();

                console.log(movingFrog.clientRect().x , movingFrog.clientRect().y )
                $(movingFrog.cssObj).css('z-index', '5');
                $frog.css('transform',`translate3d(${movingFrog.clientRect().x}px, ${movingFrog.clientRect().y}px, 0px)`);
              }else{



            $frog.children("img").attr('src',('images/icons8-Poison-96.png'));
            setTimeout( function(){
                $frog.children("img").attr('src',('images/frog.png'))
                //remove a frog life
                hasCollided = true;
                $frogImages[lives].remove();

                setPosition($frog, "245px", "600px", 0);
                frogX = 245;
                frogY = 600;
                },600);
             if(hasCollided === true){
                    lives--;
                }
                hasCollided = false;
}
        }//end of if statement
      })//end of forEach

      //----------------- GAME OVER CODE ---------------//
      let $enterNameMsg = $('#enterName');

      if(lives == 0){
          $enterNameMsg.css("visibility", "visible");
          $(document).on('keydown', (e) => {moveFrog(e)}).off();
          clearInterval(setIntID);
       }
    }//end of checkForCrashFrog



  //-------------------   Move Frog   ---------------//
    let $score = $('#score');
    let score = 0;

    function moveFrog(event) {
         //when arrow keys are pressed move as advised
      switch (event.keyCode) {
        case 37:
          //make sure frog is within screen
          if(frogX <= 4 ){
            event.preventDefault();
          }else{
          frogX -= 30;}
          movingFrog.posXmin = frogX;
          movingFrog.posXmax = movingFrog.posXmin + movingFrog.cssWidth;
          // console.log(frogX);
          $frog.css('transform',`translate3d(${frogX}px, ${frogY}px, 0px)`);  //left
          break;
        case 38:
          if(frogY <= 0 ){
            event.preventDefault();
          }else{
          frogY -= 30;}
          score += 10;
          $score.text(`${score}`);
          movingFrog.posYmin = frogY;
          movingFrog.posYmax = movingFrog.posYmin + movingFrog.cssHeight;
          $frog.css('transform',`translate3d(${frogX}px, ${frogY}px, 0px)`); //up
          break;
        case 39:
          if(frogX >= 500 ){
            event.preventDefault();
          }else{
          frogX += 30;}
          movingFrog.posXmin = frogX;
          movingFrog.posXmax = movingFrog.posXmin + movingFrog.cssWidth;
          $frog.css('transform',`translate3d(${frogX}px, ${frogY}px, 0px)`);  //right
          break;
        case 40:
          if(frogY >= 600 ){
            event.preventDefault();
          }else{
          frogY += 30;}
          movingFrog.posYmin = frogY;
          movingFrog.posYmax = movingFrog.posYmin + movingFrog.cssHeight;
          $frog.css('transform',`translate3d(${frogX}px, ${frogY}px, 0px)`); //down
          break;
        } //keyCode end
        //----------------- CONDITIONS IN WATER ---------------//
        let $win= $('#win');
        let $winTime= $('#time2');

        if(frogY < 250){
            setTimeout( function(){
                $win.css("visibility", "visible");
                $winTime.text(`${counter}`);
                score += parseInt($winTime.text());
                $(document).on('keydown', (e) => {moveFrog(e)}).off();
                setPosition($frog, "245px", "600px", 0);
                frogX = 245;
                frogY = 600;
                counter = 60;
                },900);
                $win.css("visibility", "hidden");
                $(document).on('keydown', (e) => {moveFrog(e)}).off();
                // location.reload();
        }
    } //moveFrog end
     $(document).on('keydown', (e) => {moveFrog(e)});


  window.requestAnimationFrame(moveObj);
}


