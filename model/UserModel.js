const mongoose = require("mongoose");

const watchlistItemSchema = new mongoose.Schema({
    poster_path: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    id: {
        type: String,
        require: true
    }
})

const schemaRules = {
    name: {
        type: String,
        required: [true, "name is require"]
    },
    email: {
        type: String,
        required: [true, "email is require"]
    },
    password: {
        type: String,
        required: [true, "password is require"],
        maxLength: 20
    },
    confirmPassword: {
        type: String,
        validate: [function () {
            return this.password == this.confirmPassword;
        }, "confirm passowrd is require"]
    },
    otp: {
        type: String
    },
    otpExpiry: {
type: Date
    },
    watchlist: [watchlistItemSchema],
    createAt: {
        type: Date,
        default: Date.now()
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ["user", "admin", "feed createtor", "modarate"],
        default: "user"
    }
}

const userSchema = new mongoose.Schema(schemaRules);

userSchema.pre("save", function () {
    this.confirmPassword = undefined
})
const UserModel = mongoose.model("signup", userSchema)

module.exports = { UserModel } 