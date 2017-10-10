
/* Request Animation Frame */
window.requestAnimationFrame = window.requestAnimationFrame ||
                               window.mozRequestAnimationFrame ||
                               window.webkitRequestAnimationFrame ||
                               window.msRequestAnimationFrame;

// Get all items
const $startBtn = $('#startBtn');
const $objects = $('.obj');
const $lateralObjs = $('.lateral-moving');
const $truck = $('#truck');
const $redcar = $('#redcar');
const $racecar = $('#racecar');
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

setPosition($truck, "300px", "320px", 0);
setPosition($redcar, "300px", "430px", 0);
setPosition($racecar, "150px", "380px", 0);
setPosition($frog, "180px", "600px", 0);




/* Create a constructor that can encompass each item */
let itemConstructor = function(obj) {
    this.cssObj = obj;
    this.cssWidth = parseInt(this.cssObj.css("width"));
    this.cssHeight = parseInt(this.cssObj.css("height"));
    this.posXmin = parseInt(this.cssObj.css('transform').split(',')[4])// returns position X - top left
    console.log()
    this.posYmin = parseInt(this.cssObj.css('transform').split(',')[5]); // returns position Y - top left
    this.posXmax = this.posXmin + this.cssWidth; // bottom right
    this.posYmax = this.posYmin + this.cssHeight; // bottom right
    // this.isMovingLeft = false;
    // this.isMovingRight = false;
    // this.isMovingTop = false;
    // this.isMovingDown = false;
}

/* Instantiate moving frog */
let movingFrog = new itemConstructor($frog);

/* Global variable */
let lateralObjsArray = []; // will contain all lateral moving items

/* Define array of all lateral moving objects and instantiate them */
$objects.each(function(index) {
    if ($(this).hasClass('lateral-moving')) {
        lateralObjsArray.push(new itemConstructor($(this)));
    }
});
console.log(lateralObjsArray[2].posXmax);
console.log(movingFrog.posXmin);


$('#startBtn').on('click', function() {
    //set the x and or coordinate of each obj
    let truckPosX = 300;
    let redcarPosX = 300;
    let racecarPosX = 150;
    let frogX = 180;
    let frogY = 600;

    //function to animate cars etc
    function moveObj(){
        //decriment or increment each item by entered numbers
        truckPosX -= 5;
        redcarPosX -= 6;
        racecarPosX += 6;

        //get element by id and add by getting px
        $truck.css('transform',`translate3d(${truckPosX}px, 320px, 0px)`);
        $redcar.css('transform',`translate3d(${redcarPosX}px, 430px, 0px)`);
        $racecar.css('transform',`translate3d(${racecarPosX}px, 380px, 0px)`);

        //when object leaves container loop back
        if(truckPosX < 0){truckPosX = 550};
        if(redcarPosX < 0){redcarPosX = 550};
        if(racecarPosX > 550){racecarPosX = 0};

        window.requestAnimationFrame(moveObj);

    }
    //function to move frog
    function moveFrog(event) {  //when arrow keys are pressed move as advised
        switch (event.keyCode) {
            case 37:
                frogX -= 30;
                movingFrog.posXmin = frogX;
                movingFrog.posXmax = movingFrog.posXmin + movingFrog.cssWidth;
                console.log(movingFrog.posXmin);
                // console.log(frogX);
                $frog.css('transform',`translate3d(${frogX}px, ${frogY}px, 0px)`);  //left
                areObjsIntersecting(movingFrog, lateralObjsArray);
                break;
            case 38:
                frogY -= 30;
                console.log(frogY);
                movingFrog.posYmin = frogY;
                movingFrog.posYmax = movingFrog.posYmin + movingFrog.cssHeight;
                console.log(movingFrog.posYmin);
                $frog.css('transform',`translate3d(${frogX}px, ${frogY}px, 0px)`); //up
                areObjsIntersecting(movingFrog, lateralObjsArray);
                break;
            case 39:
                frogX += 30;
                movingFrog.posXmin = frogX;
                movingFrog.posXmax = movingFrog.posXmin + movingFrog.cssWidth;
                console.log(movingFrog.posXmin);
                $frog.css('transform',`translate3d(${frogX}px, ${frogY}px, 0px)`);  //right
                areObjsIntersecting(movingFrog, lateralObjsArray);
                break;
            case 40:
                frogY += 30;
                movingFrog.posYmin = frogY;
                movingFrog.posYmax = movingFrog.posYmin + movingFrog.cssHeight;
                $frog.css('transform',`translate3d(${frogX}px, ${frogY}px, 0px)`); //down
                areObjsIntersecting(movingFrog, lateralObjsArray);
                break;
        }
        console.log('frog position');
        console.log(movingFrog.posYmin);
        console.log(movingFrog.posXmin);


        if(areObjsIntersecting(movingFrog, lateralObjsArray)){

            alert("touching");
        }else{
            return false;
        }

        window.requestAnimationFrame(moveFrog);
    }

    $(document).on('keydown', moveFrog)



    function isRangeIntersecting(frogMin, frogMax, otherMin, otherMax){
        return Math.max(frogMin, frogMax) >= Math.min(otherMin, otherMax) && Math.min(frogMin,frogMax) <= Math.max(otherMin, otherMax)
        console.log(frogMin);
        console.log(otherMin);
    }

    function areObjsIntersecting(frogRange, otherRange){
        let frogXmin = frogRange.posXmin;
        let frogXmax = frogRange.posXmax;
        let frogYmin = frogRange.posYmin;
        let frogYmax = frogRange.posYmax;

        // let otherXmin = otherRange.posXmin;
        // let otherXmax = otherRange.posXmax;
        // let otherYmin = otherRange.posYmin;
        // let otherYmax = otherRange.posYmax;

        for (index in lateralObjsArray) {
            // console.log("other  ", otherRange[index].posYmin)
            return isRangeIntersecting(frogXmin, frogXmax, otherRange[index].posXmin, otherRange[index].posXmax) &&
                   isRangeIntersecting(frogYmin, frogYmax, otherRange[index].posYmin, otherRange[index].posYmax);

            // let xIntersection = isRangeIntersecting(frogXmin, frogXmax, otherRange[index].posXmin, otherRange[index].posXmax);

            // let yIntersection = isRangeIntersecting(frogYmin, frogYmax, otherRange[index].posYmin, otherRange[index].posYmax);

            // if (xIntersection && yIntersection) {
            //     alert('touching!!!');
            //     return true;
            // }
            // else {
            //     // console.log(false);
            //     return false;
            // }
        }

    }



    window.requestAnimationFrame(moveObj);
    // window.requestAnimationFrame(moveFrog);
});
