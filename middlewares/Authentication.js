const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

exports.isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.userId);
      if (!user) {
        return res.json({
          success: false,
          message: "Forbidden: Unauthorized access!",
        });
      }
      req.user = user;
      next();
    } catch (error) {
      res.json({ success: false, message: `Forbidden: ${error.message}` });
    }
  } else {
    res.json({ success: false, message: "Forbidden: Unauthorized access!" });
  }
  //   console.log(req.headers.authorization);
};
