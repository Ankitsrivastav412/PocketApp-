const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String,
        required: true,
        unique:true
    },
    emailAddress: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required:true

    },
    profilePic: {
        type: String,
        required: true
    },

}, { timestamps: true })

module.exports = mongoose.model("register", profileSchema)