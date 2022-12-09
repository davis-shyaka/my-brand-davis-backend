const express = require("express");
const router = express.Router();
const {
  createUser,
  userSignIn,
  uploadProfile,
  signOut,
  allUsers,
  deleteUser,
} = require("../controllers/UserController");
const { isAuth } = require("../middlewares/Authentication");
const {
  validateUserSignUp,
  userValidation,
  validateUserSignIn,
} = require("../middlewares/validation/UserValidation");
const multer = require("multer");

const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Invalid image file", false);
  }
};
const uploads = multer({ storage, fileFilter });

// get all users
router.get("/allUsers", allUsers);

// create new user
router.post("/createUser", validateUserSignUp, userValidation, createUser);

// sign in user
router.post("/signIn", validateUserSignIn, userValidation, userSignIn);

// sign out user
router.post("/signOut", isAuth, signOut);

// Delete posts
router.delete("/deleteUser/:id", deleteUser);

// upload profile image
router.post("/uploadProfile", isAuth, uploads.single("profile"), uploadProfile);

module.exports = router;
