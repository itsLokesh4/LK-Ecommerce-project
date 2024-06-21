const couponCollection = require('../model/couponModel')
const orderCollection = require('../model/orderModel')


const couponManagement = async (req, res,next)=>{
    try {
       const couponDet = await couponCollection.find({ isListed: true}).sort({_id: -1})
       res.render('adminPages/couponManagement',{couponDet})
    } catch (err){
        console.log(err);
    }
}

const addCoupon = async ( req,res)=>{
    try{
        const newCoupon = new couponCollection({
            couponCode: req.body.couponCode,
            couponAmount: req.body.couponAmount,
            expiryDate: req.body.expiryDate,
            minimumPurchase: req.body.minimumPurchase,
            startDate: req.body.startDate
        })

        await newCoupon.save()
        res.send({success: true})
    }catch (err) {
        console.log(err);
    }
}

const editCouponGet = async (req,res)=>{
    try {
        const couponDet = await couponCollection.findOne({_id: req.query.couponId, isListed: true})
        res.render('adminPages/couponEdit', {couponDet})
    }catch (err){
        console.log(err);
    }
}

const adminEditCoupon = async (req,res)=>{
    try{
        const couponExists = await couponCollection.findOne({
            couponCode: {$regex: new RegExp('^' + req.body.couponCode + '$', 'i')}

        });
        const couponDet = await couponCollection.findOne({_id:req.query.id})
        if(couponExists && couponDet.couponCode != req.body.couponCode){
            res.send({couponExists: true})
        }else if (/^\s*$/.test(req.body.couponCode)){
            res.send({ noValue: true})
        }else {
            await couponCollection.updateOne({_id: req.query.id},{
                $set :{
                    couponCode: req.body.couponCode,
                    couponAmount: req.body.couponAmount,
                    expiryDate: req.body.expiryDate,
                    minimumPurchase: req.body.minimumPurchase,
                    startDate: req.body.startDate

                }
            })
            res.send({success: true})
        }

    }catch( err){
        console.log(err);
    }
}


const deleteCoupon = async(req,res)=>{
    try{
         await couponCollection.updateOne({_id:req.query.id},{$set:{isListed: false}})
         res.send({success: true})
    }catch(err){
        console.log(err);
    }
}

const applyCoupon = async(req,res)=>{
    try{
        if (/^\s*$/.test(req.query.code)) {
            res.send({ noValue: true })
        } else if (req.query.code) {
            const couponDet = await couponCollection.findOne({ couponCode: req.query.code })
            if (couponDet) {
                const couponDet = await couponCollection.findOne({ couponCode: req.query.code })
                const orderDetail = await orderCollection.find({ userId: req.session.logged._id, couponApplied: couponDet._id })
               

                if (orderDetail.length>0) {
                    res.send({ alreadyApplied: true })
                } else {
                    const order = await orderCollection.findOne({ _id: req.session.orderDetails })
                    const couponDet = await couponCollection.findOne({ couponCode: req.query.code })
                    if (order.grandTotalCost > couponDet.minimumPurchase) {
                        await orderCollection.updateOne(
                            { _id: req.session.orderDetails },
                            {
                                $set: { couponApplied: couponDet._id },
                                $inc: { grandTotalCost: -couponDet.couponAmount }
                            }
                        );
                        res.send({ success: true, orderDet: req.session.orderDetails })

                    } else {
                        res.send({ couponNotValid: true })
                    }
                }



            } else {
                res.send({ noCoupon: true })
            }
        }
    }catch (err){
        console.log(err)
    }
}

const removeCoupon = async(req,res)=>{
    
        try {
            const order = await orderCollection.findOne({ _id: req.session.orderDetails });
            const coupon = await couponCollection.findOne({ _id: order.couponApplied });
        
            await orderCollection.updateOne(
                { _id: order._id },
                {
                    $set: {
                        couponApplied: null
                    },
                    $inc: {
                        grandTotalCost: +coupon.couponAmount
                    }
                }
            );
            res.send({ success: true });

    }catch (err){
        console.log(err)
    }
}


module.exports = {
    couponManagement,
    addCoupon,
    editCouponGet,
    adminEditCoupon,
    deleteCoupon,
    applyCoupon,
    removeCoupon
}