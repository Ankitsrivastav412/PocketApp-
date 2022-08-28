const express = require("express");

const router = express.Router();
const profileController =require("../controllers/MainProfileController")
const MiddleWare = require("../middleware/auth")


router.post("/profile",profileController.createProfile);
router.post("/login",profileController.login);
router.get("/getProfile/:profileId",MiddleWare.authorize,profileController.getProfile);



module.exports=router