const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:false,

    auth:{
        user:"lokilokesh7706@gmail.com",
        pass:"elvy zlva hgxu qyyk"
    },

    authMethod:"PLAIN"
})

module.exports=transporter