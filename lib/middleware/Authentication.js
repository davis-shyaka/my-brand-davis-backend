import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

const isAuth = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.userId);
      if (!user) {
        res.status(403);
        return res.json({
          success: false,
          message: "Unauthorized access.",
        });
      }
      const userInfo = {
        id: user._id,
        surname: user.surname,
        givenName: user.givenName,
        email: user.email,
        avatar: user.avatar ? user.avatar : "",
        token: user.tokens,
      };
      req.user = userInfo;
      next();
    } catch (error) {
      res.json({ success: false, message: `Forbidden: ${error.message}` });
    }
  } else {
    res.status(403).json({
      success: false,
      message: "Unauthorized access! You need to first log in.",
    });
  }
};

// admin middleware
const isAdmin = async (req, res, next) => {
  try {
    let user = await User.findOne({ _id: req.user.id });
    if (!user) {
      res.status(403);
      return res.json({
        success: false,
        message: "Forbidden: Unauthorized access.",
      });
    }
    if (user.isAdmin === false) {
      return res.json({
        success: false,
        message: "Access Denied! Not an admin",
      });
    }
    if (user.isAdmin === true) {
      next();
    }
  } catch (error) {
    res.json({ success: false, message: `Forbidden: ${error.message}` });
  }
};

export { isAuth, isAdmin };
