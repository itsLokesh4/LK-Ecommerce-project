const Address = require("ipaddr.js");
const addressCollection = require('../model/addressModel');
const userCollection = require("../model/userModel")


const userAddressfn = async (req, res) => {
    let userInfo = req.session.userInfo
    let addressData = await addressCollection.find({
        userId: req.session.userInfo._id
    }).populate('userId')
    console.log(addressData)

    if (addressData.length <= 0) {
        addressData = false
    }

    //   console.log(addressData)

    res.render("userViews/addressPage", {
        currentUser: req.session.userInfo._id,
        addressData
    });
}

const addAddressfn = (req, res) => {
    res.render("userViews/ADDaddress", {
        currentUser: req.session.currentUser
    })
}



const saveaddressfn = async (req, res) => {

    const { email } = req.session.userInfo
    console.log(email);
    const user = await userCollection.findOne({ email: email })
    // console.log(user)
    // console.log(req.body)
    const userAddress = {
        userId: user._id,
        fname: req.body.name,
        phone: req.body.phone,
        Address: req.body.Address,
        State: req.body.State,
        City: req.body.City,
    }
    const newAddress = await addressCollection.insertMany([userAddress])
    const newAddress1 = await addressCollection.findOneAndUpdate({ _id: req.params.id }, { primary: true });
    req.session.address = newAddress
    res.redirect('/address')

}


const editAddressfn = async (req, res) => {
    req.session.userInfo;
    const existingAddress = await addressCollection.findOne({
        _id: req.params.id,
    });
    res.render("userViews/editAddress", { existingAddress })
}

const postEditAddressfn = async (req, res) => {
    try {
        // console.log(req.body)
        const address = {
            fname: req.body.name,
            phone: req.body.phone,
            Address: req.body.Address,
            State: req.body.State,
            City: req.body.City,
        };
        await addressCollection.updateOne({ _id: req.params.id }, address);
        res.redirect("/address");
    } catch (err) {
        console.log(err)
    }
}



const deleteAddressfn = async (req, res) => {
    try {
        await addressCollection.deleteOne({ _id: req.params.id });
        res.redirect("/address");
    } catch (err) {
        console.log(err);
    }
}



const PrimaryCheckfn = async (req, res) => {
    try {
        await addressCollection.findOneAndUpdate({ _id: req.params.id }, { primary: true });
        res.redirect("back")
    } catch (err) {
        console.log(err)
    }
};



const notPrimaryCheckfn = async (req, res) => {
    try {
        await addressCollection.findOneAndUpdate({ _id: req.params.id }, { primary: false });
        res.redirect("back")
    } catch (err) {
        console.log(err)
    }
}



module.exports = {

    userAddressfn,
    addAddressfn,
    saveaddressfn,
    editAddressfn,
    postEditAddressfn,
    deleteAddressfn,
    PrimaryCheckfn,
    notPrimaryCheckfn
}




