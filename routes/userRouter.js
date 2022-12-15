"use strict";

// create App function
module.exports = (app) => {
  // post controller

  const user = require("../controllers/UserController");

  // user middleware
  const { validate } = require("../middleware/validationMiddleware");

  // user validation schemas
  const validation = require("../middleware/validation/UserValidation");

  // authentication middleware
  const { isAuth, isAdmin } = require("../middleware/Authentication");

  // user Routes

  // get and post requests for /user endpoints
  app.route("/user/all").get([isAuth, isAdmin], user.allUsers); //all users
  app.route("/user/get/:id").get([isAuth, isAdmin], user.getUser); // individual user
  app
    .route("/user/sign_up")
    .post(validate(validation.userSignUp), user.createUser); // create user
  app
    .route("/user/log_in")
    .post(validate(validation.userSignIn), user.userSignIn); // user sign in
  app.route("/user/log_out").post(isAuth, user.signOut); // user sign-out

  // patch and delete request for /user endpoints
  // app.route("/user/update/:id").patch(user.updateUser); // update user
  app.route("/user/delete/:id").delete([isAuth, isAdmin], user.deleteUser); // delete user
};
