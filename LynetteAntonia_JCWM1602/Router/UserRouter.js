// Import Controller
const express = require('express')
const Router = express.Router()

const {Register, Login, DeactivateAccount, ActivateAccount, CloseAccount} = require('./../Controller/UserController')
const jwt = require('./../Middleware/JWT')


Router.post('/register', Register)
Router.post('/login', Login)
Router.patch('/deactive', jwt, DeactivateAccount)
Router.patch('/activate', jwt, ActivateAccount)
Router.patch('/close', jwt, CloseAccount)

module.exports = Router