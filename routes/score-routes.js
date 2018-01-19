const express = require('express')
const scoreRouter = express.Router()

const scores = require('../db/scores')

scoreRouter.get('/', (req, res) => {
  res.json({
    message: 'ok',
    data: {
      scores: scores
    }
  })
})

scoreRouter.get('/:id', (req, res) => {
  const requestedScore = scores.filter(score => {
    return (score.id === parseInt(req.params.id))
  })[0]
  res.json({
    message: 'ok',
    data: {
      score: requestedScore
    }
  })
})

module.exports = scoreRouter
