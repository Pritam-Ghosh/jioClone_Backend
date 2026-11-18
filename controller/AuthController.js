const { UserModel } = require("../model/UserModel");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")
const util = require("util")
const promisify = util.promisify
const promisedJWTsign = promisify(jwt.sign);
const promisedJWTverify = promisify(jwt.verify);

const handleSignUp = async (req, resp) => {
  try {
    const userObject = req.body;
    const user = await UserModel.create(userObject)
    console.log(userObject)
    resp.status(200).json({
      status: "success",
      user: user
    })

  } catch (err) {
    console.log(err.message)
    resp.status(400).json({
      status: "failure",
      err: err.message
    })
  }
}

const handleLogin = async (req, resp) => {

  try {
    const { email, password } = req.body
    const user = await UserModel.findOne({ email: email })
    if (!user || password != user.password) {
      return resp.status(404).json({
        status: "failure",
        message: "email or password incorrect"
      })
    }
    else {
      const authToken = await promisedJWTsign({ userId: user._id }, process.env.JWT_SECRET_KEY)
      resp.cookie("userInfo", authToken, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
      })

      return resp.status(200).json({
        status: "success",
        message: `login successfull`,
        user: user
      })
    }

  } catch (err) {
    console.log(err.message)
    resp.status(400).json({
      status: "failure",
      err: err.message
    })
  }
}

const handleProfile = async (req, resp) => {
  try {

    const user = await UserModel.findById(req.userId)

    console.log("userObject", user)

    if (!user) {
      return resp.status(404).json({
        status: "failure",
        message: "user not found",
      })
    }


    return resp.status(200).json({
      status: "success",
      user: user
    })

  } catch (err) {
    console.log(err.message)
    return resp.status(400).json({
      status: "failure",
      err: err.message
    })
  }
}

const handleProtectRoute = async (req, resp, next) => {
  try {
    if (!req.cookies || !req.cookies.userInfo) {

      return resp.status(401).json({
        message: "Please login first"
      })
    }
    const authToken = req.cookies.userInfo;
    const unlockToken = await promisedJWTverify(authToken, process.env.JWT_SECRET_KEY);
    req.userId = unlockToken.userId;
    next()


  } catch (err) {
    console.log(err.message)
    resp.status(400).json({
      status: "failure",
      err: err.message
    })
  }
}

const handleLogout = async (req, resp) => {
  try {
    resp.cookies("userInfo")
    resp.status(200).json({
      status: "success",
      message: "Logout Successfull"
    })
  } catch (err) {
    console.log(err.message);
    resp.status(400).json({
      status: "failed",
      err: err.message
    });

  }
}



module.exports = { handleSignUp, handleLogin, handleProfile, handleProtectRoute,handleLogout }