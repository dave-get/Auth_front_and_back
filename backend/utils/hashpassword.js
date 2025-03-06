const { createHmac } = require("crypto");
const { hash, compare } = require("bcryptjs");

exports.dohash = (password) => {
  const saltRounds = 12;
  const result = hash(password, saltRounds);
  return result;
};

exports.dohashValidation = (password, hashedPassword) => {
  const result = compare(password, hashedPassword);
  return result;
};

exports.hmacProcess = (value, key) => {
  const result = createHmac("sha256", key).update(value).digest("hex");
  return result;
};
