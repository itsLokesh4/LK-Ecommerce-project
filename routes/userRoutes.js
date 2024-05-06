const express = require("express");
const userController = require("../controller/userController");
const { isUser, isBlocked } = require("../middleware/userAuth.js")
const router = express.Router();


const addressController = require('../controller/addressController')
const cartController = require('../controller/cartController')
const orderController = require('../controller/orderController.js')








// Login and sigup , landing , OTP page and verfiy OTP pages
router.get("/", userController.landingPage);
router.get("/signUp", userController.signUp);
router.get("/login", userController.login)
router.get("/logout", userController.logout)
router.post("/saveUser", userController.saveUser)
router.post("/register", userController.register)
router.get("/sendOtp", userController.otpPage)
router.post("/verifyOtp", userController.verifyOtp)
router.post('/resendOtp', userController.resendOtp)
router.post("/login", userController.userLogin)
router.get('/shop', userController.shopPage)
router.get("/singleProduct",isUser,isBlocked, userController.singleProduct)





// pageing process

router.get("/profile", isUser, isBlocked, userController.userProfilefn)
router.get("/profileEdit", isUser, isBlocked, userController.ProfileEditpage)
router.post('/postprofileEdit/:id', isUser, isBlocked, userController.postEditprofilefn)
router.get('/passchange', isUser, isBlocked, userController.passchange)
router.patch('/changePassword', isUser, isBlocked, userController.PostpassChange)



// address


router.get("/address", isUser, isBlocked, addressController.userAddressfn)
router.get("/addressAdd", isUser, isBlocked, addressController.addAddressfn)
router.post('/saveAddress', isUser, isBlocked, addressController.saveaddressfn)
router.get('/editAddress/:id', isUser, isBlocked, addressController.editAddressfn)
router.post('/editAddress/:id', isUser, isBlocked, addressController.postEditAddressfn)
router.get('/deleteAddress/:id', isUser, isBlocked, addressController.deleteAddressfn)
router.get('/primary/:id', isUser, isBlocked, addressController.PrimaryCheckfn)
router.get('/notPrimary/:id', isUser, isBlocked, addressController.notPrimaryCheckfn)




// cart 

router.get('/cart/:id', isUser, isBlocked, cartController.cartpagefn)
router.get('/cart', isUser, isBlocked, cartController.cartpagefn)
router.get('/addto-cart', isUser, cartController.addtoCart)
router.put('/cart/decQty/:id', isBlocked, cartController.decQty)
router.put('/cart/incQty/:id', isBlocked, cartController.incQty)
router.delete('/cart/delete/:id', isUser, isBlocked, cartController.deleteFromCart)
// router.get("/checkout",isBlocked,cartController.getcheckoutpagefn)






// order 

router.get("/orders", isUser, orderController.allordersfn)
router.get("/orderStatus/:id", isBlocked, orderController.singleorderfn)
// userRouter.post("/razorpayOrderCreated:id",isBlocked,isUser,genOrder)
router.post('/checkout/orderPlaced', isBlocked, isUser, cartController.orderPlaced);
router.all('/confirmOrder', isBlocked, isUser, cartController.orderPlacedEnd)
router.put('/account/orderList/orderStatus/cancelOrder/:id', isBlocked, isUser, orderController.cancelOrder)
router.put('/account/orderList/orderStatus/returnorder/:id', isBlocked, isUser, orderController.returnRequest)
// userRouter.get('/account/orderList/orderStatus/downloadInvoice/:id',isBlocked,isUser,downloadInvoice)














module.exports = router;
