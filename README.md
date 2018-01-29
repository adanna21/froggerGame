# PSEUDO FROGGER
A replica of the classic frogger game

### PROJECT GOALS

1. Create an API using `Express.js` that can store player scores.
- POST creates new user and new score.
- GET retrieves users.
- PUT updates the names of existing users.
- DELETE removes existing users.
2. Create a frogger game with win and loose scenarios

### APPROACH

- All images are loaded in one object: Images
- ItemConstructor is used to place images on canvas and store size and etc 
``` javascript
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

```


### TECHNOLOGIES

- `Jquery`: front-end 
- `HTML Canvas`: front-end
- `Express.js`: a back-end framework that allows the construction of servers.
- `PostgreSQL`: a back-end framework that creates and manages a database.

### PACKAGE DEPENDENCIES

- `pg-promise`
- `morgan`
- `express`
- `body-parser`
