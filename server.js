/* setting up express */
const express = require('express')
const path = require('path')
const logger = require('morgan')
const bodyParser = require('body-parser')

const app = express()

/* setting up port & listen */
const PORT = process.env.PORT || 3000
app.listen(PORT, function () {
  console.log(`listening on port ${PORT}`)
})

/* setting static file */
app.use(express.static(path.join(__dirname, 'public')))
/* setting up logger */
app.use(logger('dev'))
/* setting up body parser */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

/* setting routes */
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

/* importing routes */
const scoreRoutes = require('./routes/score-routes')
app.use('/scores', scoreRoutes)

/* handling 404 */
app.get('*', function (req, res) {
  res.status(404).send({message: 'Oops! Not found.'})
})
