const { UserModel } = require("../model/UserModel");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")
const util = require("util");
const { sendEmail } = require("../utils/DynamicEmailSender");
const promisify = util.promisify
const promisedJWTsign = promisify(jwt.sign);
const promisedJWTverify = promisify(jwt.verify);
const fs = require("fs");
const path = require("path");

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


function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}



const handleForgetPassword = async (req, resp) => {
  try {
    if (req.body.email == undefined) {
      return resp.status(400).json({
        status: "failure",
        message: "Please enter the correct email!"
      });
    }

    const user = await UserModel.findOne({
      email: req.body.email
    });

    if (user == null) {
      return resp.status(404).json({
        status: "failure",
        message: "Email not found"
      });
    }

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpiry = Date.now() + 1000 * 60 * 10;

    await user.save({ validateBeforeSave: false });


    resp.status(200).json({
      message: "otp is send successfully",
      status: "success",
      otp: otp,
      resetURL: `http://localhost:3200/api/auth/resetPassword/${user["_id"]}`
    });


    const templateData = {
      user: user.name,
      otp: user.otp
    };


    await sendEmail(
      "../templates/otp.html",
      user.email,
      templateData
    );

  } catch (err) {
    console.log("Forgot password error:", err);

    if (!resp.headersSent) {
      return resp.status(500).json({
        status: "failure",
        message: "Unable to send OTP email",
        error: err.message
      });
    }
  }
};


const handleResetPassword = async (req, resp) => {
  try {
    const { email, otp, password, confirmPassword } = req.body

    if (!email || !otp || !password || !confirmPassword) {
      return resp.status(400).json({
        status: "failure",
        message: "Please fill in all fields"
      })
    }

    if (password !== confirmPassword) {
      return resp.status(400).json({
        status: "failure",
        message: "Password confrim password not match"
      })
    }


    const user = await UserModel.findOne({ email })
    if (!user) {
      return resp.status(404).json({
        status: "failure",
        message: "user not found!"
      })
    }

    if (!user.otp) {
      return resp.status(404).json({
        status: "failure",
        message: "otp not found!"
      })
    }

    if (!user.otp) {
      return resp.status(404).json({
        status: "failure",
        message: "otp not found!"
      })
    }

    if (Date.now() > new Date(user.otpExpiry).getTime()) {
      return resp.status(401).json({
        status: "failure",
        message: "OTP expired. Please request a new OTP"
      })
    }

    if (String(user.otp).trim() !== String(otp).trim()) {
      return resp.status(400).json({
        status: "failure",
        message: "OTP is incorrect"
      });
    }

    user.password = password
    user.confirmPassword = confirmPassword

    user.otp = undefined
    user.otpExpiry = undefined

    await user.save()



    return resp.status(200).json({
      status: "success",
      message: "Password reset successfully"
    });

  } catch (err) {
    console.log("Reset Password Error:", err);

    return resp.status(500).json({
      status: "failure",
      message: "Unable to reset password",
      err: err.message
    });
  }
}


module.exports = {
  handleSignUp,
  handleLogin,
  handleProfile,
  handleProtectRoute,
  handleLogout,
  handleForgetPassword,
  generateOTP,
  handleResetPassword
}