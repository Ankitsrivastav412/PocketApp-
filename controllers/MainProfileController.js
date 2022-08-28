const profileModel = require("../models/profileModel");
const aws = require("../awsConfigs/aws");
const { isValid, isEmptyBody, isValidEmail, isValidPhone, isValidPassword } = require("../validator/validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createProfile = async function (req, res) {
    try {
        let data = req.body;
        let files = req.files;
        let { fullName, profession, phoneNo, emailAddress, password } = data;

        if (isEmptyBody(data)) {
            return res.status(404).send({ status: false, msg: "data is Mandatory" })
        }


        if (!isValid(fullName)) {
            return res.status(400).send({ status: false, msg: "fullName is required" })
        }

        if (!isValid(profession)) {
            return res.status(400).send({ status: false, msg: "profession is required" })
        }

        if (!isValid(phoneNo)) {
            return res.status(400).send({ status: false, msg: "phoneNo is required" })
        }

        if(!isValidPhone(phoneNo)){
            return res.status(400).send({status:false,msg:"invalid phone "})
        }

        const isphoneNoInUse = await profileModel.findOne({ phoneNo: phoneNo })
        if (isphoneNoInUse) {
            return res.status(400).send({ status: false, message: "phone No is already registered, please enter different phoneNo" })
        }


        if (!isValid(emailAddress)) {
            return res.status(400).send({ status: false, msg: "email is required" })
        }

        if(!isValidEmail(emailAddress)){
            return res.status(400).send({status:false,msg:"invalid email "})
        }

        const isEmailInUse = await profileModel.findOne({ emailAddress: emailAddress })
        if (isEmailInUse) {
            return res.status(400).send({ status: false, msg: "email already registered, enter different email" })
        }

        if(!isValidPassword(password)){
            return res.status(400).send({status:false, msg:" "})
        }

        const encryptedPassword = await bcrypt.hash(data.password, 10)

        let profilePic = await aws.uploadFile(files[0])
        if (!profilePic) {
            return res.status(400).send({ status: false, msg: "upload error" })
        }

        const newData = {
            "fullName": fullName,
            "profession": profession,
            "phoneNo": phoneNo,
            "emailAddress": emailAddress,
            "password": encryptedPassword,
            "profilePic": profilePic
        }
        let registerDone = await profileModel.create(newData);
        return res.status(201).send({ status: true, msg: "registeration done Succesfully", data: registerDone })
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

const login = async function (req, res) {
    try {
        let data = req.body;

        let check = await profileModel.findOne({
            $or: [{
                "emailAddress": data.emailAddress
            }, {
                "phoneNo": data.phoneNo
            }]
        });
        if (!check) {
            return res.status(400).send({ status: false, msg: "email&phone is incorrect" })
         
        }
      
         else {
            let payload = { profileId: check._id }
            let token = jwt.sign(payload, "pocket")
            if (token) {
                res.setHeader("x-auth-token", token)
            }
            res.status(200).send({ status: true, msg: "logged in succesfully", data: token })
        }

    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }


}

const getProfile = async function (req, res) {
    try {
        if (req.profileId != req.params.profileId) {
            return res.status(400).send({ status: false, msg: "Not Authorize" })
        }
        let profileId = req.params.profileId
        if(!profileId){
            return res.status(400).send({status:false,msg:"please fill profileId"})
        }
        let checkId = await profileModel.findById(profileId)
        if (!checkId) {
            return res.status(404).send({ status: false, msg: "profile not found" })
        }
        else {
            return res.status(200).send({ status: true, msg: "profile found", data: checkId })
        }
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}




module.exports = { createProfile, login, getProfile }
