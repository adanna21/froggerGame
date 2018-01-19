const express = require('express')
const usersController = require('../controllers/users-controller')

const userRoutes = express.Router()

console.log('user routes')

userRoutes.get('/', usersController.index)
userRoutes.get('/:id', usersController.show)

userRoutes.post('/', usersController.create)
userRoutes.put('/:id', usersController.update)
userRoutes.delete('/:id', usersController.destroy)

module.exports = userRoutes
