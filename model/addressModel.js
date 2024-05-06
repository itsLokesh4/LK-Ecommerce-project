const mongoose = require("mongoose")
// const addressSchema = require('../model/addressSchema');

// create address schema (in which format data will go)

const addressSchema = new mongoose.Schema({
    userId:{ type: mongoose.Types.ObjectId, ref:'users'},
    fname: String,
    lname: String,
    phone:Number,
    Address:String,
    State:String,
    City: String,
    primary:{ type : Boolean, default:false,}
})

const addressCollection = mongoose.model("address", addressSchema)

module.exports = addressCollection