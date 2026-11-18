// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
require("dotenv").config({
  path: "../.env"
});

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
console.log(process.env.SENDGRID_API_KEY?.slice(0, 3));
// sgMail.setDataResidency('eu'); 
// uncomment the above line if you are sending mail using a regional EU subuser

const sendEmail = async () => {
  try {
    const msg = {
      to: 'pritam0799@gmail.com', // Change to your recipient
      from: 'pritam7599@gmail.com', // Change to your verified sender
      subject: 'Sending with SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    }
    await sgMail.send(msg);
    console.log("email send")
  } catch (err) {
    console.log(error.response?.body || error.message);
  }
}
sendEmail();