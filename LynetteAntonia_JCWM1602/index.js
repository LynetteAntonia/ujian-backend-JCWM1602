const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
require('dotenv').config()

// main app
const app = express()

// apply middleware
app.use(cors())
app.use(bodyparser.json())

// main route
const response = (req, res) => res.status(200).send('<h1>REST API JCWM1602</h1>')
app.get('/', response)

//Import router

const UserRouter = require('./Router/UserRouter')
const MoviesRouter = require('./Router/MoviesRouter')



app.use('/user', UserRouter) // register, login, activate, deactive, close
app.use('/movies', MoviesRouter) 



// bind to local machine
const PORT = process.env.PORT || 2000
app.listen(PORT, () => `CONNECTED : port ${PORT}`)