const orderCollection = require("../model/orderModel")
const userCollection = require("../model/userModel")


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


module.exports = {
    allordersfn,
    singleorderfn,
    cancelOrder,
    returnRequest
}