"use strict";

// create App function
module.exports = (app) => {
  // post controller

  const mail = require("../controllers/MailController");

  // mail middleware
  const {
    validateMailCreation,
    mailValidation,
  } = require("../middleware/validation/mailValidation");

  // authentication middleware
  const { isAuth, isAdmin } = require("../middleware/Authentication");

  // mail Routes

  // get and post requests for /mail endpoints
  app.route("/mail/all").get(mail.allMail); //all mails
  app.route("/mail/get/:id").get(mail.getMail); // individual mail
  app
    .route("/mail/create")
    .post(validateMailCreation, mailValidation, mail.createMail); // create mail

  // patch and delete request for /mail endpoints
  app.route("/mail/delete/:id").delete(mail.deleteMail); // delete mail
};
