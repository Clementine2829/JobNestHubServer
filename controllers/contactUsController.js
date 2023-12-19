const asyncHandler = require("express-async-handler");
const { json } = require("express");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

//@desc Send an email
//@route POST api/contact-us
//@access private
const getContactUs = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, message } = req.body;
  if (!firstName || !lastName || !email || !message) {
    res.status(400);
    throw new Error("All fields are required");
  }

  //   const emailSent = Contact.sendEmail
  const emailSent = true;
  const emailSubject = "Test Email";
  message = `Hi ${firstName} ${lastName},\n\n${message}`;
  sendEmail(email, emailSubject, message);

  if (emailSent) {
    res.status(200).json({ "Simple Email": "Email sent successfully" });
  } else {
    res.status(400);
    throw new Error("Compay data is not valid");
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "my-email@gmail.com",
    pass: "my-password",
  },
});

const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: "your-email@gmail.com",
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = {
  getContactUs,
};
