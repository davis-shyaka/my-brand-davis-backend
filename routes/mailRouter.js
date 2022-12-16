"use strict";

// create App function
module.exports = (app) => {
  // post controller

  const mail = require("../controllers/MailController");

  // mail middleware

  const { validate } = require("../middleware/validationMiddleware");

  const validation = require("../middleware/validation/mailValidation");

  // authentication middleware
  const { isAuth, isAdmin } = require("../middleware/Authentication");

  // mail Routes

  // get and post requests for /mail endpoints
  app.route("/mail/all").get([isAuth, isAdmin], mail.allMail); //all mails
  app.route("/mail/get/:id").get([isAuth, isAdmin], mail.getMail); // individual mail
  app
    .route("/mail/create")
    .post(validate(validation.mailCreation), mail.createMail); // create mail

  // patch and delete request for /mail endpoints
  app.route("/mail/delete/:id").delete([isAuth, isAdmin], mail.deleteMail); // delete mail
};
