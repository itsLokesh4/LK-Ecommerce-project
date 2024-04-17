// module.exports=function (req,res,next){
//     try{
//         if(req.session.logged){
//             next()
//         }else{
//             res.redirect('/signUp')
//         }
//     }catch(err){
//         console.log(err);
//     }
// }


// isblock session handle 

const isUser= async (req,res,next)=>{
    if(req.session.userInfo){
        next()
    }else {
        res.redirect("/login")
    }
}


const isBlocked = async (req,res,next)=>{
    if(req.session.isBlocked){
        res.redirect("/login")
    }else{
        next()
    }
}


module.exports = {isUser,isBlocked}