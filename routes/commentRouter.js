"use strict";

// create App function
module.exports = (app) => {
  // post controller

  const comment = require("../controllers/commentController");

  // comment middleware
  const {
    validateCommentCreation,
    commentValidation,
  } = require("../middleware/validation/commentValidation");

  // authentication middleware
  const { isAuth, isAdmin } = require("../middleware/Authentication");

  // comment Routes

  // get and post requests for /comment endpoints
  app.route("/comment/all").get(comment.allComments); //all comments
  app.route("/comment/get/:id").get(comment.getComment); // individual comment
  app
    .route("/comment/create/on/post/:id")
    .post(validateCommentCreation, commentValidation, comment.createComment); // create comment

  // patch and delete request for /comment endpoints
  app.route("/comment/delete/:id").delete(comment.deleteComment); // delete comment
};
