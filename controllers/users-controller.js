const User = require('../models/User')

const usersController = {}

usersController.index = (req, res) => {
  User.findAll()
  .then(users => {
    res.json({
      message: 'ok',
      data: {
        users: users
      }
    })
  })
  .catch(err => {
    res.status(400).json(err)
  })
}

usersController.show = (req, res) => {
  User.findById(req.params.id)
  .then(user => {
    res.json({
      message: 'ok',
      data: {
        user: user
      }
    })
  })
  .catch(err => {
    console.log(err)
    res.status(400).json(err)
  })
}

usersController.create = (req, res) => {
  User.create({
    score: req.body.score
  })
  .then(user => {
    res.json({
      message: 'User created successfully',
      data: {
        user: user
      }
    })
  })
  .catch(err => {
    res.status(400).json(err)
  })
}

usersController.update = (req, res) => {
  User.update({
    score: req.body.score
  }, req.params.id)
  .then(user => {
    res.json({
      message: 'quote updated successfully',
      data: {
        user: user
      }
    })
  })
  .catch(err => {
    res.status(400).json(err)
  })
}

usersController.destroy = (req, res) => {
  User.destroy(req.params.id)
    .then(() => {
      res.json({
        message: 'User deleted successfully'
      })
    })
    .catch(err => {
      res.status(400).json(err)
    })
}

module.exports = usersController
