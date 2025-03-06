const nodeMailer = require("nodemailer");

const transport = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODE_CODE_SENDIGN_EMAIL,
    pass: process.env.NODE_CODE_SENDIGN_EMAIL_PASSWORD,
  },
});

module.exports = transport;
