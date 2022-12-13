const express = require("express");
const {
  allMail,
  createMail,
  deleteMail,
} = require("../controllers/MailController");
const { isAuth } = require("../middleware/Authentication");
const {
  validateMailCreation,
  mailValidation,
} = require("../middleware/validation/MailValidation");
const router = express.Router();

// Get all mail
router.get("/mail/all", allMail);

// Create mail
router.post("/mail/create", validateMailCreation, mailValidation, createMail);

// Delete mail
router.delete("/mail/delete/:id", isAuth, deleteMail);

module.exports = router;