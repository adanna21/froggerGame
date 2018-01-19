const express = require('express')
const scoresController = require('../controllers/scores-controller')

const scoreRoutes = express.Router()

console.log('score routes')

scoreRoutes.get('/', scoresController.index)
scoreRoutes.get('/:id', scoresController.show)

scoreRoutes.post('/', scoresController.create)
scoreRoutes.put('/:id', scoresController.update)
scoreRoutes.delete('/:id', scoresController.destroy)

module.exports = scoreRoutes
