
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

require("dotenv").config({
  path: path.join(__dirname, "../.env")
});


// STEP 1: Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 465,
  secure: true,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY
  }
});


// STEP 2: Read HTML template and replace dynamic values
async function updateTemplateHelper(templatePath, toReplaceObject) {

  const fullPath = path.resolve(__dirname, templatePath);

  let templateContent = await fs.promises.readFile(
    fullPath,
    "utf-8"
  );

  const keyArr = Object.keys(toReplaceObject);

  keyArr.forEach((key) => {
    templateContent = templateContent.replaceAll(
      `{{${key}}}`,
      String(toReplaceObject[key])
    );
  });

  return templateContent;
}


// STEP 3: Send email
const sendEmail = async (templatePath, receiverEmail, templateData) => {

  try {

    // Generate final HTML content
    const html = await updateTemplateHelper(
      templatePath,
      templateData
    );

    // Check recipient
    if (!receiverEmail) {
      throw new Error("Recipient email is missing");
    }

    // Email details
    const msg = {
      to: receiverEmail,
      from: "pritam7599@gmail.com",
      subject: "Password Reset OTP",
      text: `Your OTP is ${templateData.otp}`,
      html: html
    };

    console.log("Sending email to:", receiverEmail);
    console.log("HTML loaded:", html.length > 0);
    console.log("SendGrid API key loaded:", !!process.env.SENDGRID_API_KEY);

    // Send email
    const info = await transporter.sendMail(msg);

    console.log("Email sent:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);

    return info;

  } catch (err) {

    console.log("Email error:", err.message);

    throw err;
  }
};


module.exports = { sendEmail };
