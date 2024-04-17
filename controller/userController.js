const bcrypt = require("bcrypt")
// Import necessary modules
const userCollection = require("../model/userModel")
const otpCollection = require("../model/otpModel")
const path = require('path');
// nodemailer require
const nodemailer = require("nodemailer")
// sendOTP 
const sendotp = require("../helper/sendOtp")
// Product Collection
const productCollection = require('../model/productModel');
// categoryCollection
const categoryCollection = require('../model/categoryModel');







const landingPage = ( req , res ) =>{
    try {
        if(req.session.logged) {
            console.log(req.session.logged)
            res.render("userViews/landingPage", {userName: req.session.logged})
        }else {
            res.render("userViews/landingPage",{userName: null})
        }
    }catch (err) {
        console.log(err);
    }
}


const signUp = async (req, res) => {
    try {
        if (req.session.logged) {
            res.redirect('/')
        } else {
            res.render('userViews/signup', { userLogged: req.userLogged } )
        }
    } catch (err) {
        console.log(err);
    }
}

const login = async (req, res) => {
    try {
        if (req.session.logged) {
            res.redirect('/')
        } else {
            res.render('userViews/login')
        }
     }catch (err) {
        console.log(err);
     }
}


const logout = async (req,res) =>{
    try {
        req.session.logged = false 
        res.redirect('/')
    }catch (err) {
        console.log(err);
    }
}


const otpPage = (req,res) =>{
   try {
    if(req.session.user) {
        res.render('/')
    }else{
        res.render('userViews/verifyOtp')
    }
   }catch (err) {
    console.log(err);
   }
}


const register = async (req,res)=>{
    try {
       
        const checkSignin = await userCollection.findOne({ $or: [{email: req.body.email},{phone: req.body.phone}]})
        
        if(checkSignin){
            res.status(208).send({userExists:true})
        }else{
            res.status(200).send({userExists:false})
        }
    }catch (err) {
        console.log(err);
    }
}


const saveUser = async (req, res) => {
    try {

        const bycryptpassword = bcrypt.hashSync(req.body.password, 10)
        const newUser = new userCollection({
            name: req.body.name,
            email: req.body.email,
            password: bycryptpassword,
            phone: req.body.phone
        })
        await newUser.save()

        req.session.logged = await userCollection.findOne({ email: req.body.email })


        if (req.query.otp) {
            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()

            await sendotp(req.session.logged, generatedOtp)
            const bycryptotp = bcrypt.hashSync(generatedOtp, 10)
            const userotp = new otpCollection({
                userId: req.session.logged._id,
                otp: bycryptotp,
                generatedDate: new Date().toISOString(),
                expiryDate: new Date(Date.now() + 60000).toISOString()
            })
            await userotp.save()
        }
        res.status(200).send({ userSaved: true })
    } catch (err) {
        console.log(err);
    }
}


const verifyOtp = async (req, res) => {


    try {
        const usersOTP = await otpCollection.findOne({ userId: req.session.logged._id })

        const otpmatch = await bcrypt.compare(req.body.otp, usersOTP.otp)
        const notExpired = usersOTP.expiryDate.toISOString() > new Date().toISOString()
        if (otpmatch && notExpired) {
            await userCollection.updateOne({ _id: req.session.logged._id }, { $set: { isVerified: true } })
            req.session.user = true
            res.status(200).send({ otpverified: true })
        } else {
            res.status(200).send({ otpinvalid: true })
        }
    } catch (error) {
        console.log(error);
    }
}


const resendOtp = async (req, res) => {
    try {

        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()
        await sendotp(req.session.logged, generatedOtp)
        const bycryptotp = bcrypt.hashSync(generatedOtp, 10)
        await otpCollection.updateOne({ userId: req.session.logged._id }, { $set: { otp: bycryptotp, generatedDate: new Date().toISOString(), expiryDate: new Date(Date.now() + 60000).toISOString() } })

        res.status(200).send({ otpsend: true })
    } catch (err) {
        console.log(err);
    }
}



const userLogin = async (req, res) => {
    try {
        const user = await userCollection.findOne({ email: req.body.email })
      
        if(user.isBlocked){
         
            req.session.logged=false
            res.redirect('/login')
        }


        if (user) {
            const passwordMatch = await bcrypt.compare(req.body.password, user.password)
            if (passwordMatch) {
                req.session.logged = user
                res.redirect('/')
            } else {
                res.send({ invalid: true })
            }
        } else {
            res.send({ invalid: true })
        }
    } catch (err) {
        console.log(err);
    }
}




// Define the sendOtp function
const sendOtp = (req, res) => {
    // Assuming 'verifyOtp' view file is located in the 'views/userViews' directory
    const viewFilePath = path.join(__dirname, '..', 'views', 'userViews', 'otpPage');
    
    // Render the view file
    res.render(viewFilePath, { /* optional data to pass to the view */ });
};

// Export the sendOtp function
module.exports = {
    sendOtp
};





const singleProduct = async (req, res) => {
    try {
        const productDetails = await productCollection.findOne({ _id: req.query.id }).populate('parentCategory')
     console.log(req.query)
        // const categoryDetails = await categoryCollection.findOne({ _id: req.query.id })
        console.log(productDetails)
        res.render('userViews/singleProduct', { _id:req.body.user_id, userLogged: req.session.logged, productDet: productDetails })
    } catch (err) {
        console.log(err);
    }
}

// { product: product }


const shopPage = async (req, res) => {
    try {
        const productDetails = await productCollection.find()
        res.render('userViews/shop', { productDet: productDetails })      
     }
    
     catch (err) {
        console.log(err);
    }
}

// userProfilefn

const userProfilefn = async (req,res)=>{
    try{
        const currentUser = req.session.userInfo
        const walletBalance = await walletCollection.findOne({userId:currentUser._id})
        console.log("profile inn")
        console.log(walletBalance)
        const userInfo = await userCollection.findById({_id:currentUser._id})
        res.render("user/Profilepage",{userInfo,walletBalance:walletBalance})  
    }catch (err){
        console.log(err)
    }
}







module.exports = {
    landingPage,
    signUp,
    login,
    register,
    saveUser,
    logout,
    otpPage,
    verifyOtp,
    resendOtp,
    userLogin,
    singleProduct,
    shopPage,
    userProfilefn
}