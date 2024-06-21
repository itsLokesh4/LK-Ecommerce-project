const { ObjectId } = require('mongodb');
const cartCollection = require('../model/cartModel')
const productCollection = require('../model/productModel')
const userCollection = require("../model/userModel");
const addressCollection = require("../model/addressModel")
const orderCollection = require("../model/orderModel")
const mongoose = require('mongoose');
const couponCollection = require('../model/couponModel')

// const ObjectId = mongoose.Types.ObjectId;




const grandTotal = async (req) => {
    try {
        let userCartData = await cartCollection
            .find({ userId: req.session.userInfo._id })
            .populate("productId");
        let grandTotal = 0;
        for (const v of userCartData) {
            grandTotal += v.productId.productPrice * v.productQuantity;
            await cartCollection.updateOne(
                { _id: v._id },
                {
                    $set: {
                        totalCostPerProduct: v.productId.productPrice * v.productQuantity,
                    },
                }
            );
        }
        userCartData = await cartCollection
            .find({ userId: req.session.userInfo._id })
            .populate("productId");
        req.session.grandTotal = grandTotal;
        return JSON.parse(JSON.stringify(userCartData));
    } catch (error) {
        console.log(error);
    }
}






// const cartpagefn = async (req, res) => {
//     try {
//         // console.log(cartProduct);
//         const userInfo = req.session?.userInfo
//         let userCartData = await grandTotal(req);

//         let empty;
//         userCartData == 0 ? (empty = true) : (empty = false);
        
//         let cartProduct  = await cartCollection.find()
//         res.render("userViews/cartpage", {
//             user: req.session?.userInfo,
//             userCartData,
//             grandTotal: req.session.grandTotal,
//             empty,
//             userCartData:cartProduct
//         })
//     } catch (err) {
//         console.log(err);
//     }
// }

const cartpagefn = async (req, res) => {
    try {
      const userInfo = req.session?.userInfo
      let userCartData = await grandTotal(req);
  
      let empty;
      userCartData == 0 ? (empty = true) : (empty = false);
  
      // Get cart products
      const cartProducts = await cartCollection.find({ userId: userInfo._id });
    //  console.log(cartProducts);
      res.render("userViews/cartpage", {
        user: req.session?.userInfo,
        userCartData,
        grandTotal: req.session.grandTotal,
        empty,
        cartProducts
      })
    } catch (err) {
      console.log(err);
    }
  }

// const addtoCart = async (req, res) => {
//     try {
//         //   console.log("njsdbhushbu uukyfmd");
//         console.log(typeof req.query.prodId);
//         const prodID = new ObjectId(req.query.prodId)
//         const userID = new ObjectId(req.session.userInfo._id)

//         // const productss = await productCollection.aggregate([{$match:{_id:prodID}}])
//         // console.log(productss);
//         // const prods = await cartCollection.find()
//         // console.log(prods);
//         const users = await userCollection.findOne()
//         console.log(users);

        
//         // let existingProduct = await cartCollection.findOne({
//         //     userId: req.session.userInfo._id,
//         //     productId: req.query.prodId,
//         // });
//         // console.log(existingProduct);


//         // if (existingProduct && existingProduct.productQuantity < productss.productStock) {
//         //     await cartCollection.updateOne(
//         //         { _id: existingProduct._id },
//         //         { $inc: { productQuantity: 1 } }
//         //     );
//         // } else if (!existingProduct) {
//         //     await cartCollection.insertMany([
//         //         {
//         //             userId: req.session.userInfo._id,
//         //             productId: req.query.prodId,
//         //             productQuantity: req.body.productQuantity,
//         //         },
//         //     ]);
//         // }
//         // res.redirect("/cart");
//     } catch (error) {
//         console.log(error);
//     }
// };


// const addtoCart = async (req, res) => {
//     try {
//         // console.log( req.query.prodId);
//         // console.log(userCollection);

//         const users = await userCollection.find()
//                 console.log(users);

//         if (!ObjectId.isValid(req.query.prodId)) {
//             return res.status(400).json({ error: 'Invalid product ID' });
//         }
        
//         if (!ObjectId.isValid(req.session.userInfo._id)) {
//             return res.status(400).json({ error: 'Invalid user ID' });
//         }
        
//         const prodID = new ObjectId(req.query.prodId);
//         const userID = new ObjectId(req.session.userInfo._id);

//         // ... rest of the code ...
//         // res.redirect("/cart");

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
//   };

// const addtoCart = async (req, res) => {
//     try {
//       // console.log("njsdbhushbu uukyfmd");
//       let existingProduct = null;
//       existingProduct = await cartCollection.findOne({
//         userId: req.session.userInfo._id,
//         productId: req.params.id,
//       });

//       const productss = await productCollection.findOne({_id: req.params.id})
//       if (existingProduct && existingProduct.productQuantity <productss.productStock ) {
//         await cartCollection.updateOne(
//           { _id: existingProduct._id },
//           { $inc: { productQuantity: 1 } }
//         );
//       } else if(!existingProduct) {
//         await cartCollection.insertMany([
//           {
//             userId: req.session.userInfo._id,
//             productId: req.params.id,
//             productQuantity: req.body.productQuantity,
//           },
//         ]);
//       }
//       res.redirect("/cart");
//     } catch (error) {
//       console.log(error);
//     }
//   };

const addtoCart = async (req, res) => {

    // console.log(existingProduct);
    try {
    //   var existingProduct = null;
    //   let prodID = String(req.query.prodId)
       var  existingProduct = await cartCollection.findOne({
        userId: req.session.userInfo._id,
        productId: req.query.prodId,
      });
    //    console.log(req.query)
      const productss = await productCollection.findOne({ _id: req.query.prodId });
  
      // Check if the productId exists
      if (!req.query.prodId) {
        throw new Error("productId is required");
      }
  
      if (existingProduct && existingProduct.productQuantity < productss.productStock) {
        await cartCollection.updateOne(
          { _id: existingProduct._id },
          { $inc: { productQuantity: 1 } }
        );
      } else if (!existingProduct) {
        await cartCollection.insertMany([
          {
            userId: req.session.userInfo._id,
            productId: req.query.prodId,
            productQuantity: req.body.productQuantity,
          },
        ]);
      }
    //   console.log("srghyhfjk,ktet");
    //   res.render('userViews/cartpage',{ empty })
    res.redirect("/cart");
        

    } catch (error) {
      console.log(error);
    }
  }; 

// const addtoCart = async (req, res) => {
//     try {
//       const prodId = req.query.prodId;
//       const userId = req.session.userInfo._id;
  
//       // Input validation
//       if (!prodId) {
//         return res.status(400).json({ error: 'productId is required' });
//       }
  
//       // Check if product exists
//       const product = await productCollection.findOne({ _id: prodId });
//       if (!product) {
//         return res.status(404).json({ error: 'Product not found' });
//       }
  
//       // Check if product is in stock
//       if (product.productStock <= 0) {
//         return res.status(400).json({ error: 'Product is out of stock' });
//       }
  
//       // Check if cart item already exists
//       const existingCartItem = await cartCollection.findOne({
//         userId,
//         productId: prodId,
//       });
  
//       if (existingCartItem) {
//         // Update cart item quantity
//         await cartCollection.updateOne(
//           { _id: existingCartItem._id },
//           { $inc: { productQuantity: 1 } }
//         );
//       } else {
//         // Create new cart item
//         await cartCollection.insertMany([
//           {
//             userId,
//             productId: prodId,
//             productQuantity: 1,
//           },
//         ]);
//       }
  
//       // Redirect to cart page
//       res.redirect('/cart');
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     }
//   };

const incQty = async (req, res) => {
    try {
        let cartProduct = await cartCollection
            .findOne({ _id: req.params.id })
            .populate("productId");

        if (cartProduct.productQuantity < cartProduct.productId.productStock) {
            cartProduct.productQuantity++;
        }
        cartProduct = await cartProduct.save();
        await grandTotal(req);
        res.json({ cartProduct, grandTotal: req.session.grandTotal });

    } catch (error) {
        console.log(error)
    }
}

const decQty = async (req, res) => {
    try {
        let cartProduct = await cartCollection
            .findOne({ _id: req.params.id })
            .populate("productId");

        if (cartProduct.productQuantity > 1) {
            cartProduct.productQuantity--;
        }
        cartProduct = await cartProduct.save();
        await grandTotal(req);
        res.json({
            cartProduct,
            grandTotal: req.session.grandTotal
        });


    } catch (error) {
        console.log(error)
    }
}

const deleteFromCart = async (req, res) => {
    try {
        await cartCollection.findOneAndDelete({ _id: req.params.id });
        res.send("HI your Cart is deleted Successfully ");
    } catch (error) {
        console.error(error)
    }
}


const orderPlaced = async (req, res) => {
    try {
        //incase of COD
        await orderCollection.updateOne(
            { _id: req.session.currentOrder._id },
            {
                $set: {
                    paymentId: "generatedAtDelivery",
                    paymentType: "COD",
                },
            }
        );
        res.json({ success: true });
        res.redirect("/checkout/orderPlacedEnd");
    } catch (error) {
        console.error(error);
    }
};


// const orderPlacedEnd = async (req, res) => {
//     try {
//         // redirect to the order placed page
//         res.redirect("userViews/checkout2");
//     } catch (error) {
//         console.error(error);
//     }
// };


const orderPlacedEnd = async (req, res) => {
  try {
  let cartData = await cartCollection
    .find({ userId: req.session.userInfo._id })
    .populate("productId");

  for (const item of cartData) {
    item.productId.productStock -= item.productQuantity; // we use for reducing Qyantity
    item.productId.stockSold += 1;  //stocjSolf ++
    await item.productId.save();
  }

  cartData.map(async (v) => {
    v.productId.productStock -= v.productQuantity; //reducing from stock qty
    await v.productId.save();
    return v;
  })
  let orderData = await orderCollection.findOne({ _id: req.session.currentOrder._id})
  if(orderData.paymentType =='online'){
    await orderCollection.updateOne({ _id: req.session.currentOrder._id}, { $set : { paymentType: 'COD'   }  })
  }
  let x = await cartCollection.findByIdAndUpdate({ _id: req.session.currentOrder._id}).populate("productId");
  res.render("userViews/checkout2", {
    signIn: req.session.signIn,
    user: req.session.user,
    orderCartData: cartData,
    orderData: req.session.currentOrder,
  });
  //delete product from cart since the order is placed
  await cartCollection.deleteMany({ userId: req.session.userInfo._id });
  } catch (error) {
    console.log(error)
  }
};

const getcheckoutpagefn = async (req, res) => {
    try {
        console.log("lokesh")
      const addresscheck = await addressCollection.find({userId:req.session?.userInfo?._id})
      if(addresscheck.length==0){
          res.redirect("/addressAdd")
      }else{
        let cartData = await cartCollection
        .find({ userId: req.session.userInfo._id, productId: req.params.id })
        .populate("productId");
        let addressData = await addressCollection.find({
          userId: req.session.userInfo._id,
          
        });
        console.log(addressData)


     console.log("Hunais")
      req.session.currentOrder = await orderCollection.create({
        userId: req.session.userInfo._id,
        orderNumber: (await orderCollection.countDocuments()) + 1,
        orderDate: new Date(),
        addressChosen: JSON.parse(JSON.stringify(addressData[0])),
        cartData: await grandTotal(req),
        grandTotalCost: req.session.grandTotal,
      });
      // const coupons = await couponCollection.find(); 
    console.log("ljdfadlf")
      let userCartData = await grandTotal(req);
      console.log("dvykjiu")
      req.session.save()
      console.log("jggghfvd")
      console.log(req.session.address)
      res.render("userViews/checkout1", {
        signIn: req.session.signIn,
        user: req.body.user,
        currentUser: req.session.userInfo,
        grandTotal: req.session.grandTotal,
        userCartData,
        cartData,
        addressData:addressData,
        addressData,
        // coupons: coupons 
      });
      }
      
    } catch (error) {
      console.log(error);
      res.redirect("/cart");
    }
  };

//   const getcheckoutpagefn=async(req,res)=>{

//     try{
//       const cart= await cartCollection.find({userId:req.query.user}).populate('productId')
       
//       Sum=0
//       for(let i=0;i<cart.length;i++){
//        Sum=Sum+cart[i].totalCostPerProduct
//       }
//       req.session.grandTotal=Number(Sum)
//       const address= await addressCollection.find({userId:req.query.user})
      
//       res.render('userViews/checkout1',{userLogged:req.session.logged,grandTotal:req.session.grandTotal,addressDet:address})
//     }
//     catch(error){
//       console.log(error)
//     }
//   }



module.exports = {
    cartpagefn,
    addtoCart,
    decQty,
    incQty,
    deleteFromCart,
    getcheckoutpagefn,
    orderPlacedEnd,
    orderPlaced
}