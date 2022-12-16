import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import sharp from "sharp";
import cloudinary from "../helper/imageUpload.js";

// Get all users
const allUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get individual user
const getUser = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    } else res.status(200).json(user);
  } catch (error) {
    res.status(404).send({ success: false, message: "User doesn't exist!" });
  }
};

// create a new user
const createUser = async (req, res) => {
  try {
    const { surname, givenName, email, password } = req.body;
    const isNewUser = await User.isThisEmailInUse(email);
    if (!isNewUser)
      return res.status(409).json({
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
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Error creating user: ${error.message}`,
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }, req.body, {
      new: true,
    });

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(404);
    res.json({ success: false, message: "User doesn't exist!" });
    console.log("Error updating user: ", error.message);
  }
};

// Sign In
const userSignIn = async (req, res) => {
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
    token,
  };
  res.status(200).json(userInfo);
};

// Upload Profile Picture / Avatar
const uploadProfile = async (req, res) => {
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
const signOut = async (req, res, next) => {
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
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      console.log("Error while signing out: ", error.message);
    }
  }
};

// deleteUser function - To delete user by id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    await user.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "User successfully deleted", user });
  } catch (error) {
    res.status(404);
    res.json({
      success: false,
      message: "User doesn't exist.",
    });
  }
};

export default {
  allUsers,
  getUser,
  createUser,
  userSignIn,
  signOut,
  updateUser,
  deleteUser,
  uploadProfile,
};
