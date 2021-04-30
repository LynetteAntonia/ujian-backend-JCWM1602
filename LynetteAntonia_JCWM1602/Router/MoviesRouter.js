// Import Controller
const express = require('express')
const Router = express.Router()

const {getMovies, addMovie, getUpcomingandOnShow, editMovieStatus, addSchedule} = require('./../Controller/MoviesController')
const jwt = require('./../Middleware/JWT')


Router.get('/get/all', getMovies)
Router.get('/get/:location/:time', getUpcomingandOnShow)
Router.post('/add', jwt, addMovie)
Router.patch('/edit', jwt, editMovieStatus)
Router.patch('/set/:id', jwt, addSchedule)


module.exports = Router