const express = require('express')
const adminController = require('../controller/adminController')
const adminAuth = require('../middleware/adminAuth')
const productController = require('../controller/productController')
const categoryController = require('../controller/categoryController')
const upload = require('../services/multer.js')
// order controller 
const orderController = require('../controller/orderController')
const couponController = require('../controller/couponController.js')

const router = express.Router()


// login
router.get('/admin', adminController.loginPage)
router.post('/adminlogin', adminController.adminlogin)
router.get('/adminLogout', adminController.adminLogout)



// userManagement 
router.get('/userManagement', adminAuth, adminController.userManagement)
router.get('/userBlock', adminController.userBlock)



// product Management
router.get('/productManagement', adminAuth, productController.productManagement)
router.get('/productList', productController.productList)
router.get('/addProduct', adminAuth, productController.addProductGet)
router.post('/addProducts', adminAuth, upload.any(), productController.addProducts)
router.get('/editProduct', adminAuth, productController.editProduct)
router.post('/editProducts/:id', adminAuth, upload.any(), productController.editProducts)
router.get('/productdelete', adminAuth, productController.deleteProduct)





// category Management 

router.get('/categoryManagement', adminAuth, categoryController.categoryManagement)
router.post('/addCategory',adminAuth, categoryController.addCategory)
router.get('/categoryList',adminAuth, categoryController.categoryList)
router.post('/editCategory',adminAuth, categoryController.editCategory)



// order Management 

// router.get('/allorders')
router.get('/order', orderController.adminOrder)
// router.get('/orderStatus',orderController.orderStatus)
// router.put('/updateStatus',orderController.updateStatus)
// router.put('/updateStatus2',orderController.updateStatus2)

router.get("/orderManagement/pending/:id", orderController.changeStatusPending);
router.get("/orderManagement/shipped/:id", orderController.changeStatusShipped);
router.get("/orderManagement/delivered/:id", orderController.changeStatusDelivered);
router.get("/orderManagement/return/:id", orderController.changeStatusReturn);
router.get("/orderManagement/cancelled/:id", orderController.changeStatusCancelled);


// coupon Managemnet 

router.get('/couponManagement',adminAuth,couponController.couponManagement)
router.get('/admin/addCoupon',adminAuth,couponController.addCoupon)
router.get('/editCouponGet',adminAuth,couponController.editCouponGet)
router.post('/admin/editCoupon',adminAuth,couponController.adminEditCoupon)
router.delete('/deleteCoupon',adminAuth,couponController.deleteCoupon)



module.exports = router