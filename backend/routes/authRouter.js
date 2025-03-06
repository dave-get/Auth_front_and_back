const express = require("express");
const {
  signup,
  signin,
  signout,
  sendVerificationCode,
  verifyCode,
  changePassword,
  sendForgotPasswordCode,
  verifyForgotCode,
} = require("../controllers/authController");
const { identification } = require("../middlewares/identification");

const router = express.Router();

// SignUp
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", identification, signout);
router.patch("/send-verification-code", identification, sendVerificationCode);
router.patch("/verify-code", identification, verifyCode);
router.patch("/change-password", identification, changePassword);
router.patch("/send-forgot-password-code", sendForgotPasswordCode);
router.patch("/verify-forgot-password-code", verifyForgotCode);

module.exports = router;
