

const getLogIn = (req, res) =>{
    res.render("userViews/login")
};

const getSignUp = (req,res) =>{
    res.render("userViews/signup")
}

const otpPage = (req,res)=>{
    res.render("userViews/otpPage")
}

const landingPage = (req,res) =>{
    res.render("userViews/landingPage")
}

const forgot = (req,res) =>{
    res.render("userViews/forgotPasswordPage")
}

const singlePage = (req,res) =>{
    res.render("userViews/singlePage")
}



module.exports = {
    getLogIn,
    getSignUp,
    otpPage,
    landingPage,
    forgot,
    singlePage
}