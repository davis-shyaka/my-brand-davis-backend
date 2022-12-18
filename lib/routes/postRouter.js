// post controller
import post from "../controllers/PostController.js";

// post middleware
import validates from "../middleware/validationMiddleware.js";

import { postCreation } from "../middleware/validation/PostValidation.js";

// authentication middleware
import { isAuth, isAdmin } from "../middleware/Authentication.js";

// create App function
export default (app) => {
  // post Routes

  // get and post request for /post endpoints
  app.route("/post/all").get(post.allPosts); //all posts
  app.route("/post/get/:id").get(post.getPost); // individual post
  app
    .route("/post/create")
    .post([isAuth, isAdmin, validates(postCreation)], post.createPost); // create post

  // patch and delete request for /post endpoints
  app
    .route("/post/update/:id")
    .patch([isAuth, isAdmin, validates(postCreation)], post.updatePost); // update post
  app.route("/post/delete/:id").delete([isAuth, isAdmin], post.deletePost); // delete post
};
