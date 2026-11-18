const express = require("express");

const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")
const util = require("util")
const promisify = util.promisify
const promisedJWTsign = promisify(jwt.sign);
const promisedJWTverify = promisify(jwt.verify);
const cors = require("cors");

const dotenv = require("dotenv");

dotenv.config()

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.json())
const corsConfig = {
  origin: true,
  credentials: true
}
app.use(cors(corsConfig));

const url = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.woyjlpa.mongodb.net/`

mongoose.connect(url)
  .then(() => console.log('----connected!----'));

const {AuthRouter} = require("./router/AuthRouter")

app.use("/api/auth",AuthRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`localhost: ${PORT}`)
})

