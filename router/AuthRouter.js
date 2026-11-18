const express = require("express")


const { handleSignUp, handleLogin, handleProfile, handleProtectRoute, handleLogout } = require("../controller/AuthController")

const AuthRouter = express.Router()

AuthRouter
.post("/signup", handleSignUp)
.post("/login", handleLogin)
.get("/user",handleProtectRoute, handleProfile)
.get("/logout",handleLogout)

module.exports = {AuthRouter}