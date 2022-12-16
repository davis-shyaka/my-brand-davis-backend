// post controller

import comment from "../controllers/commentController.js";

// comment middleware
import validates from "../middleware/validationMiddleware.js";

import { commentCreation } from "../middleware/validation/commentValidation.js";

// authentication middleware
import { isAuth, isAdmin } from "../middleware/Authentication.js";

// create App function
export default (app) => {
  // comment Routes

  // get and post requests for /comment endpoints
  app.route("/comment/all").get(comment.allComments); //all comments
  app.route("/comment/get/:id").get([isAuth, isAdmin], comment.getComment); // individual comment
  app
    .route("/comment/create/on/post/:id")
    .post([isAuth, validates(commentCreation)], comment.createComment); // create comment

  // patch and delete request for /comment endpoints
  app
    .route("/comment/delete/:id")
    .delete([isAuth, isAdmin], comment.deleteComment); // delete comment
};
