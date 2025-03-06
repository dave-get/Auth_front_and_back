const Joi = require("joi");

exports.SignUpSchema = Joi.object({}).keys({
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net"] } })
    .min(6)
    .max(40)
    .required(),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")),
});

exports.SignInSchema = Joi.object({}).keys({
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net"] } })
    .min(8)
    .max(40)
    .required(),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")),
});

exports.sendVerificationCodeSchema = Joi.object({}).keys({
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net"] } })
    .min(6)
    .max(40)
    .required(),
  providedCode: Joi.number().required(),
});

exports.changePasswordSchema = Joi.object({}).keys({
  newPassword: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")),
  oldPassword: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")),
});

exports.verifyFPCodeSchema = Joi.object({}).keys({
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net"] } })
    .min(6)
    .max(40)
    .required(),
  providedCode: Joi.number().required(),
  newPassword: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$")),
});
