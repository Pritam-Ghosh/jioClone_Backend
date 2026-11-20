const nodemailer = require("nodemailer");
require('dotenv').config({ path: '../.env' });

let sendgridDetail = {
    host: 'smtp.sendgrid.net',
    port: 465,
    secure: true,
    auth: {
        user: "apikey",
        pass: process.env.SENDGRID_API_KEY
    }
}


const sendEmail = async () => {
    try {
        const msg = {
            to: 'pritam0799@gmail.com', // Change to your recipient
            from: 'pritam7599@gmail.com', // Change to your verified sender
            subject: 'Sending with SendGrid is Fun',
            text: 'and easy to do anywhere, even with Node.js',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        }

        const transpoter = nodemailer.createTransport(sendgridDetail)
        await transpoter.sendMail(msg);
        console.log("email send")
    } catch (err) {
        console.log(err.response?.body || err.message);
    }
}
sendEmail();