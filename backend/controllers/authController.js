const jwt = require("jsonwebtoken");
const {
  SignUpSchema,
  SignInSchema,
  sendVerificationCodeSchema,
  changePasswordSchema,
  verifyFPCodeSchema,
} = require("../middlewares/validator");
const User = require("../models/userModels");
const {
  dohash,
  dohashValidation,
  hmacProcess,
} = require("../utils/hashpassword");
const transport = require("../middlewares/sendMail");

// signup
const signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { error, value } = await SignUpSchema.validate({ email, password });
    if (error) {
      return res.status(400).json({
        success: false,
        message:
          "The password must contain at least one letter, one number, and one uppercase character",
      });
    }

    // check in database
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // save in database
    const hashedPassword = await dohash(password);

    const newUser = new User({ email, password: hashedPassword });
    const result = await newUser.save();
    result.password = undefined;
    return res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// signin
const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = await SignInSchema.validate({ email, password });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const existUser = await User.findOne({ email }).select("+password");
    if (!existUser) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const result = await dohashValidation(password, existUser.password);
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        user_id: existUser._id,
        email: existUser.email,
        verified: existUser.verified,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: "8h",
      }
    );

    res
      .cookie("Auuthorization", "Bearer" + token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
      })
      .json({ success: true, token, message: "logged in successfully" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// signout
const signout = async (req, res) => {
  res
    .clearCookie("Authorization")
    .status(200)
    .json({ success: true, message: "logged out successfully" });
};

// sendVerificationCode

const sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    // check in database
    const existUser = await User.findOne({ email });
    if (!existUser) {
      return res
        .status(404)
        .json({ success: false, message: "User doesn't exist" });
    }

    if (existUser.verified) {
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });
    }

    const codeValue = Math.floor(100000 + Math.random() * 1000000).toString();
    let info = await transport.sendMail({
      from: process.env.NODE_CODE_SENDIGN_EMAIL,
      to: existUser.email,
      subject: "Verification Code",
      html: '<h1 style="color: green;">' + codeValue + "</h1>",
    });

    if (info.accepted[0] === existUser.email) {
      const hashedCode = await hmacProcess(
        codeValue,
        process.env.HMAC_CODE_SECRET
      );
      existUser.verificationCode = hashedCode;
      existUser.verificationCodeValidation = Date.now();
      await existUser.save();
      return res
        .status(200)
        .json({ success: true, message: "Code sent successfully" });
    }

    res.status(400).json({ success: false, message: "code sent faild!" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// verifyCode
const verifyCode = async (req, res) => {
  const { email, providedCode } = req.body;
  try {
    const { error, value } = await sendVerificationCodeSchema.validate({
      email,
      providedCode,
    });

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const codeValue = providedCode.toString();
    const existUser = await User.findOne({ email }).select(
      "+verificationCode +verificationCodeValidation"
    );

    if (!existUser) {
      return res
        .status(404)
        .json({ success: false, message: "User doesn't exist" });
    }

    if (existUser.verified) {
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });
    }

    if (!existUser.verificationCode || !existUser.verificationCodeValidation) {
      return res
        .status(400)
        .json({ success: false, message: "Something is wrong with the code!" });
    }

    if (Date.now() - existUser.verificationCodeValidation > 300000) {
      return res.status(400).json({ success: false, message: "Code expired" });
    }

    const hashedCode = await hmacProcess(
      codeValue,
      process.env.HMAC_CODE_SECRET
    );
    if (hashedCode === existUser.verificationCode) {
      existUser.verified = true;
      existUser.verificationCode = undefined;
      existUser.verificationCodeValidation = undefined;
      await existUser.save();
      return res
        .status(200)
        .json({ success: true, message: "User verified successfully" });
    }
    return res.status(400).json({ success: false, message: "Invalid code" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// change password

const changePassword = async (req, res) => {
  const { user_id, verified } = req.user;
  const { newPassword, oldPassword } = req.body;
  try {
    const { error, value } = await changePasswordSchema.validate({
      newPassword,
      oldPassword,
    });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    if (!verified) {
      return res
        .status(400)
        .json({ success: false, message: "User not verified" });
    }

    const existUser = await User.findOne({ _id: user_id }).select("+password");
    if (!existUser) {
      return res
        .status(404)
        .json({ success: false, message: "User doesn't exist" });
    }

    const result = await dohashValidation(oldPassword, existUser.password);
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid cridentials!" });
    }

    const hashedPassword = await dohash(newPassword);
    existUser.password = hashedPassword;
    await existUser.save();
    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// forgotPassword

const sendForgotPasswordCode = async (req, res) => {
  const { email } = req.body;
  try {
    // check in database
    const existUser = await User.findOne({ email });
    if (!existUser) {
      return res
        .status(404)
        .json({ success: false, message: "User doesn't exist" });
    }

    const codeValue = Math.floor(100000 + Math.random() * 100000).toString();
    let info = await transport.sendMail({
      from: process.env.NODE_CODE_SENDIGN_EMAIL,
      to: existUser.email,
      subject: "Forgot Password Code",
      html: '<h1 style="color: green;">' + codeValue + "</h1>",
    });

    if (info.accepted[0] === existUser.email) {
      const hashedCode = await hmacProcess(
        codeValue,
        process.env.HMAC_CODE_SECRET
      );
      existUser.forgotPasswordCode = hashedCode;
      existUser.forgotPasswordCodeValidation = Date.now();
      await existUser.save();
      return res.status(200).json({ success: true, message: "Code sent!" });
    }

    return res
      .status(400)
      .json({ success: false, message: "code sent faild!" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// verify Forgot password Code

const verifyForgotCode = async (req, res) => {
  const { email, providedCode, newPassword } = req.body;
  try {
    const { error, value } = await verifyFPCodeSchema.validate({
      email,
      providedCode,
      newPassword,
    });

    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    const codeValue = providedCode.toString();
    const existUser = await User.findOne({ email }).select(
      "+forgotPasswordCode +forgotPasswordCodeValidation"
    );

    if (!existUser) {
      return res
        .status(404)
        .json({ success: false, message: "User doesn't exist" });
    }

    if (
      !existUser.forgotPasswordCode ||
      !existUser.forgotPasswordCodeValidation
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Something is wrong with the code!" });
    }

    const hashedCode = await hmacProcess(
      codeValue,
      process.env.HMAC_CODE_SECRET
    );

    if (hashedCode !== existUser.forgotPasswordCode) {
      return res.status(400).json({ success: false, message: "Invalid code" });
    }

    if (Date.now() - existUser.forgotPasswordCodeValidation > 300000) {
      return res.status(400).json({ success: false, message: "Code expired" });
    }

    const hashedPassword = await dohash(newPassword);
    existUser.password = hashedPassword;
    existUser.forgotPasswordCode = undefined;
    existUser.forgotPasswordCodeValidation = undefined;
    await existUser.save();
    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = {
  signup,
  signin,
  signout,
  sendVerificationCode,
  verifyCode,
  changePassword,
  sendForgotPasswordCode,
  verifyForgotCode,
};
