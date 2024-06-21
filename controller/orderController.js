const orderCollection = require("../model/orderModel")
const userCollection = require("../model/userModel")
const addressCollection = require('../model/addressModel')
const formatDate = require("../services/dateFormate")
const razorpay = require("razorpay")


const allordersfn =  async (req, res) => {
    try {
      let page;
      let limit=10
      let skip;
      
      page = req.query.page  || 1
      skip = (page-1)  * limit
      
      
      let orderData = await orderCollection.find({
        userId: req.session.userInfo._id,
      }).sort({orderNumber:-1}).skip(skip).limit(limit)
  
      let count = await orderCollection.find({userId:req.session.userInfo._id}).countDocuments()
  
      //sending the formatted date to the page
      orderData = orderData.map((v) => {
        v.orderDateFormatted = formatDate(v.orderDate);
        return v;
      });
  
      res.render("userViews/orders", {
        currentUser: req.session.userInfo,
        orderData,
        count,
        limit
      });
    } catch (error) {
      console.error(error);
    }
  }




const singleorderfn =  async (req, res) => {
  try {
    let orderData = await orderCollection
      .findOne({ _id: req.params.id })
      .populate("addressChosen");
      console.log(orderData)
    let isCancelled = orderData.orderStatus == "Cancelled";
    let isReturn = orderData.orderStatus == "Return";
    res.render("userViews/singleorderpage", {
      currentUser: req.session.userInfo,
      orderData,
      isCancelled,
      isReturn,
    });
  } catch (error) {
    console.error(error);
  }
}


const cancelOrder = async (req, res) => {
    try {
      const { cancelReason } = req.body;
      const orderData = await orderCollection.findOne({ _id: req.params.id });
      await orderCollection.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { orderStatus: "Cancelled", cancelReason } }
      );
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  }

  const returnRequest = async (req, res) => {
    try {
      const { ReturnReason } = req.body;
      const orderData = await orderCollection.findOne({ _id: req.params.id });
      await orderCollection.findByIdAndUpdate(
        { _id: req.params.id },
        { $set: { orderStatus: "Return", ReturnReason } }
      );
      res.json({ success: true });
    } catch (error) {
      console.error(error);
    }
  }



  // this is admin side order management 



  const adminOrder=async(req,res)=>{
    try{
      let count = await orderCollection.find().estimatedDocumentCount();
      let orderDetails = await orderCollection
        .find().sort({orderNumber: -1})
        .populate("userId")
      // res.render("admin/orderManagement", { orderData, count, limit, page });
    console.log(orderDetails.grandTotalCost)
      res.render('adminPages/ordermanagement',{orderDet:orderDetails})
    }
    catch(error){
        console.log(error)
    }
}

const changeStatusPending = async (req, res) => {
  try {
    console.log("Pending")
    await orderCollection.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { orderStatus: "Pending" } }
    );
    res.redirect("/order");
  } catch (error) {
    console.error(error);
  }
};



const changeStatusShipped = async (req, res) => {
  try {
    console.log("Shipped")
    await orderCollection.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { orderStatus: "Shipped" } }
    );
    res.redirect("/order");
  } catch (error) {
    console.error(error);
  }
};


//deliverd
const changeStatusDelivered = async (req, res) => {
  try {
    console.log("Delivered")
    await orderCollection.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { orderStatus: "Delivered" } }
    );
    res.redirect("/order");
  } catch (error) {
    console.error(error);
  }
};


const changeStatusReturn = async (req, res) => {
  try {
    console.log("Return")
    await orderCollection.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { orderStatus: "Return" } }
    );
    res.redirect("/order");
  } catch (error) {
    console.error(error);
  }
};


const changeStatusCancelled = async (req, res) => {
  try {
    let orderData = await orderCollection
      .findOne({ _id: req.params.id })
      .populate("userId");
    await walletCollection.findOneAndUpdate(
       { userId : orderData.userId._id  }, 
       { walletBalance: orderData.grandTotalCost })

    await userCollection.findByIdAndUpdate(
      { _id: orderData.userId._id },
      { wallet: orderData.grandTotalCost }
    );
    orderData.orderStatus = "Cancelled";
    orderData.save();
    res.redirect("/adminPages/orderManagement");
  } catch (error) {
    console.error(error);
  }
};



module.exports = {
    allordersfn,
    singleorderfn,
    cancelOrder,
    returnRequest,


    adminOrder,
    changeStatusPending,
    changeStatusShipped,
    changeStatusDelivered,
    changeStatusReturn,
    changeStatusCancelled
   
}