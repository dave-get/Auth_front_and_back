const jwt = require("jsonwebtoken");

exports.identification = (req, res, next) => {
  let token;
  if (req.headers.client === "not-browser") {
    token = req.headers.authorization;
  } else {
    token = req.cookies["Authorization"];
  }
  if (!token) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  try {
    const userToken = token.split(" ")[1];

    const decoded = jwt.verify(userToken, process.env.TOKEN_SECRET);
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      throw new Error("Error in the token");
    }
  } catch (err) {
    return res.status(403).json({ success: false, message: "Unauthorized!" });
  }
};
