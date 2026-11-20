const express = require("express")


const { handleSignUp, handleLogin, handleProfile, handleProtectRoute, handleLogout,handleForgetPassword,handleResetPassword, handleGetWatchlist, handleAddWatchlist } = require("../controller/AuthController")

const AuthRouter = express.Router()

AuthRouter
.post("/signup", handleSignUp)
.post("/login", handleLogin)
.get("/logout",handleLogout)

.get("/user",handleProtectRoute, handleProfile)
.get( "/user/watchlist", handleProtectRoute,handleGetWatchlist)
.post("/user/watchlist",handleProtectRoute,handleAddWatchlist)

.patch("/forgetPassword",handleForgetPassword)
.patch("/resetPassword",handleResetPassword)

module.exports = {AuthRouter}