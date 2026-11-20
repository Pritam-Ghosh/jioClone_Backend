const express = require("express")


const { handleSignUp, handleLogin, handleProfile, handleProtectRoute, handleLogout,handleForgetPassword,handleResetPassword } = require("../controller/AuthController")

const AuthRouter = express.Router()

AuthRouter
.post("/signup", handleSignUp)
.post("/login", handleLogin)
.get("/user",handleProtectRoute, handleProfile)
.get("/logout",handleLogout)

.patch("/forgetPassword",handleForgetPassword)
.patch("/resetPassword",handleResetPassword)

module.exports = {AuthRouter}