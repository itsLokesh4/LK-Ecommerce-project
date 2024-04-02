const express = require("express")
const app = express();


const session = require("express-session")
const dotenv = require("dotenv").config();
const path = require("node:path");
const router = require("./routes/userRoutes.js");
const admrouter = require("./routes/adminRoutes.js");
const dbConnect = require("./config/config.js")

dbConnect()


app.set("view engine","ejs");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,"public")));
app.use(
    session({
        secret: "Keyboard cat",
        resave:false,
        saveUninitialized:true,
    })
);



app.use(router);



app.listen(3030, ()=>{
    console.log("Server run successfully")
})