
const express = require("express")
const { handleGetCurrentMovie, handleGetMovieDetails } = require("../controller/MovieController")

const MovieRouter = express.Router()

MovieRouter
  .get("/currentPlaying", handleGetCurrentMovie)
  .get("/details/:id", handleGetMovieDetails)

module.exports={MovieRouter}