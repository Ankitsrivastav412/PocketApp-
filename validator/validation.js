const mongoose = require("mongoose")
const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

const isEmptyBody =function(data){
    if(Object.keys(data).length===0) return true;
}

const isValidEmail = (value) =>{
    return  /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value)
}

const isValidPhone = (value) => {
    return /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(value)
}

const isValidPassword= (value)=>{
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
}




module.exports={isValid,isValidObjectId,isEmptyBody,isValidEmail,isValidPhone,isValidPassword}