const express = require("express")
const app = express();
const path = require("node:path");
const session = require("express-session")
const multer = require('multer')


const dotenv = require("dotenv").config();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
})


app.use(
    session({
        secret: process.env.SESSIONSECRET,
        resave: true,
        saveUninitialized: true,
    })
);


// calling DB function to connect in starting stage 
const dbConnect = require("./config/config.js")
dbConnect()


app.set("view engine", "ejs");



const userRouter = require("./routes/userRoutes.js");
const adminRouter = require("./routes/adminRoutes.js");


app.use(userRouter);

app.use(adminRouter);



app.listen(process.env.PORT, () => {
    console.log("Server run successfully")
})