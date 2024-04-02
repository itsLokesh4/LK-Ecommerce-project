

const getLogIn = (req, res) =>{
    res.render("userViews/login")
};

const getSignUp = (req,res) =>{
   try {
     if (req.session.logged) {
        res.redirect('/')
     }else{
        res.render('userViews/signup')
     }
   }catch (err) {
    console.log(err);
   }
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