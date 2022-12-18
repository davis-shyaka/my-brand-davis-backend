import user from "../controllers/UserController.js";

// user middleware
import validates from "../middleware/validationMiddleware.js";

// user validation schemas
import validation from "../middleware/validation/UserValidation.js";

// authentication middleware
import { isAuth, isAdmin } from "../middleware/Authentication.js";

// create App function
export default (app) => {
  // user Routes

  // get and post requests for /user endpoints
  app.route("/user/all").get([isAuth, isAdmin], user.allUsers); //all users
  app.route("/user/get/:id").get([isAuth, isAdmin], user.getUser); // individual user
  app
    .route("/user/sign_up")
    .post(validates(validation.userSignUp), user.createUser); // create user
  app
    .route("/user/log_in")
    .post(validates(validation.userSignIn), user.userSignIn); // user sign in
  app.route("/user/log_out").post(isAuth, user.signOut); // user sign-out

  // patch and delete request for /user endpoints
  // app.route("/user/update/:id").patch(user.updateUser); // update user
  app.route("/user/delete/:id").delete([isAuth, isAdmin], user.deleteUser); // delete user
};
