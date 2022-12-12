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
const { isAuth, isAdmin } = require("../middlewares/Authentication");
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
router.get("/user/all", isAuth, isAdmin, allUsers);

// create new user
router.post("/user/create", validateUserSignUp, userValidation, createUser);

// sign in user
router.post("/user/sign-in", validateUserSignIn, userValidation, userSignIn);

// sign out user
router.post("/user/sign-out", isAuth, signOut);

// Delete posts
router.delete("/user/delete/:id", isAuth, isAdmin, deleteUser);

// upload profile image
router.post("/uploadProfile", isAuth, uploads.single("profile"), uploadProfile);

module.exports = router;
