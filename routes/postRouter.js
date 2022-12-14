"use strict";

// create App function
module.exports = (app) => {
  // post controller

  const post = require("../controllers/PostController");

  // post middleware
  const {
    validatePostCreation,
    postValidation,
  } = require("../middleware/validation/PostValidation");

  // authentication middleware
  const { isAuth, isAdmin } = require("../middleware/Authentication");
  // post Routes

  // get and post request for /post endpoints
  app.route("/post/all").get(post.allPosts); //all posts
  app.route("/post/get/:id").get(post.getPost); // individual post
  app
    .route("/post/create")
    .post(validatePostCreation, postValidation, post.createPost); // create post

  // patch and delete request for /post endpoints
  app.route("/post/update/:id").patch(post.updatePost); // update post
  app.route("/post/delete/:id").delete(post.deletePost); // delete post
};
