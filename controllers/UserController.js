const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const sharp = require("sharp");
const cloudinary = require("../helper/imageUpload");

// Get all users
exports.allUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, message: "All Users: ", users });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// create a new user
exports.createUser = async (req, res) => {
  const { surname, givenName, email, password } = req.body;
  const isNewUser = await User.isThisEmailInUse(email);
  if (!isNewUser)
    return res.json({
      success: false,
      message: "This email is already in use",
    });
  const user = await User({
    surname,
    givenName,
    email,
    password,
  });
  await user.save();
  res.json({ success: true, user });
};

// Sign In
exports.userSignIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user)
    return res.json({
      success: false,
      message: "User not found that matches this email",
    });

  const isMatch = await user.comparePassword(password);

  if (!isMatch)
    return res.json({
      success: false,
      message: "Password does not match given email",
    });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  let oldTokens = user.tokens || [];
  if (oldTokens.length) {
    oldTokens = oldTokens.filter((token) => {
      const timeDiff = (Date.now() - parseInt(token.signedAt)) / 1000;
      if (timeDiff < 86400) {
        return token;
      }
    });
  }
  await User.findByIdAndUpdate(user._id, {
    tokens: [...oldTokens, { token, signedAt: Date.now().toString() }],
  });
  const userInfo = {
    surname: user.surname,
    givenName: user.givenName,
    email: user.email,
    avatar: user.avatar ? user.avatar : "",
    // token: user.tokens.length ? user.tokens[0].token : "",
    token,
  };
  req.user = userInfo;
  res.json({ success: true, user: userInfo });
};

// Upload Profile Picture / Avatar
exports.uploadProfile = async (req, res) => {
  const { user } = req;
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Forbidden: Unauthorized access" });
  }

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "my-brand/userAvatars",
      public_id: `${user._id}_profile`,
      width: 500,
      height: 500,
      crop: "fill",
    });
    await User.findByIdAndUpdate(user._id, { avatar: result.url });
    res.status(201).json({ success: true, message: "Avatar Set Succesfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Try again after some time",
    });
    console.log("Error while uploading avatar: ", error.message);
  }
};

// Sign Out
exports.signOut = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization failure",
      });
    }
    const tokens = req.user.token;

    const newTokens = tokens.filter((t) => t.token !== token);

    try {
      await User.findByIdAndUpdate(req.user._id, { tokens: newTokens });
      res
        .status(201)
        .json({ success: true, message: "Signed Out Succesfully" });
    } catch (error) {
      console.log("Error while signing out: ", error.message);
    }
  }
};

// Delete users
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    await user.remove();
    res.json({ success: true, message: "User deleted succesfully", user });
  } catch (error) {
    // res.status(404);
    res.json({
      success: false,
      message: "User couldn't be deleted. Try again later.",
    });
    console.log("Error deleting user: ", error.message);
  }
};
