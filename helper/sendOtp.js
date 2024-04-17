const transporter = require("../services/sendOTP")


let sendotp = async (user,otp) =>{
    try{
        console.log(user.email)
        await transporter.sendMail({
            from:process.env.MAILID,
            to:user.email,
            subject:"Registration OTP for LK Cart",
            text:`Here is your One Time Password for registration: ${otp} `

        })
    }catch (err){
        console.log(err);
    }
}

module.exports=sendotp 