const express = require("express")


const { handleSignUp, handleLogin, handleProfile, handleProtectRoute } = require("../controller/AuthController")

const AuthRouter = express.Router()

AuthRouter
.post("/signup", handleSignUp)
.post("/login", handleLogin)
.get("/user",handleProtectRoute, handleProfile)

module.exports = {AuthRouter}