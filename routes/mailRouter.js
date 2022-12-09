const express = require("express");
const {
  allMail,
  createMail,
  deleteMail,
} = require("../controllers/MailController");
const { isAuth } = require("../middlewares/Authentication");
const {
  validateMailCreation,
  mailValidation,
} = require("../middlewares/validation/MailValidation");
const router = express.Router();

// Get all mail
router.get("/allMail", allMail);

// Create mail
router.post("/createMail", validateMailCreation, mailValidation, createMail);

// Delete mail
router.delete("/deleteMail/:id", isAuth, deleteMail);

module.exports = router;
