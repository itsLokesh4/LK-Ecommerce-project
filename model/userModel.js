const mongoose = require("mongoose")


// create schema (in which format data will go )
const userSchema = new mongoose.Schema({
    fname:{
        require:true,
        type:String
    },
    lname:{
      require:true,
      type:String
   },
    email:{
        required:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    phone:{
        required:true,
        type:Number
    },
    isBlocked:{
        required:true,
        type:Boolean,
        default:false
    },
    referralCode:{
        required:false,
        type:String,
    },
    referralUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    isVerified:{
        required:true,
        type:Boolean,
        default:false,
    }
})



// model is a communication for DB and node.js

module.exports = mongoose.model('users',userSchema)
