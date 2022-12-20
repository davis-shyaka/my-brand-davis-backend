import post from '../controllers/PostController.js'
import validates from '../middleware/validationMiddleware.js'
import { postCreation } from '../middleware/validation/PostValidation.js'
import { isAuth, isAdmin } from '../middleware/Authentication.js'

// create App function
export default (app) => {
  // get and post request for /post endpoints
  /**
   * @openapi
   * '/post/all':
   *  get:
   *     tags:
   *     - Post
   *     summary: Get all Posts
   *     responses:
   *       200:
   *         description: Success
   *         content:
   *          application/json:
   *            schema:
   *              type: array
   *              posts:
   *                type: object
   *                properties:
   *                  title:
   *                    type: string
   *                  caption:
   *                    type: string
   *                  content:
   *                    type: string
   *       400:
   *         description: Bad request
   */
  app.route('/post/all').get(post.allPosts) // all posts
  app.route('/post/get/:id').get(post.getPost) // individual post
  /**
   * @openapi
   * '/post/create':
   *  post:
   *     tags:
   *     - Post
   *     summary: Create a Post
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *            type: object
   *            required:
   *              - id
   *              - title
   *              - caption
   *              - content
   *            properties:
   *              id:
   *                type: number
   *                default: 2
   *              title:
   *                type: string
   *                default: I felt dizzy
   *              caption:
   *                type: string
   *                default: Aye
   *              content:
   *                type: string
   *                default: Trophy in the hood, wish a n...a would
   *     responses:
   *      201:
   *        description: Created
   *      409:
   *        description: Conflict
   *      404:
   *        description: Not Found
   */
  app
    .route('/post/create')
    .post([isAuth, isAdmin, validates(postCreation)], post.createPost) // create post

  // patch and delete request for /post endpoints
  /**
   * @openapi
   * '/post/update/{id}':
   *  put:
   *     tags:
   *     - Post
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The unique id of the Post
   *        required: true
   *     summary: Modify a Post
   *     requestBody:
   *      required: true
   *      content:
   *        application/json:
   *           schema:
   *            type: object
   *            required:
   *              - id
   *              - title
   *              - caption
   *              - content
   *             properties:
   *              id:
   *                type: number
   *                default: 2
   *              title:
   *                type: string
   *                default: What are you looking for
   *              caption:
   *                type: string
   *                default: Aye
   *              content:
   *                type: string
   *                default: Trophy in the hood, wish a n...a would
   *     responses:
   *      200:
   *        description: Modified
   *      400:
   *        description: Bad Request
   *      404:
   *        description: Not Found
   */
  app
    .route('/post/update/:id')
    .patch([isAuth, isAdmin, validates(postCreation)], post.updatePost) // update post
  /**
   * @openapi
   * '/post/delete/{id}':
   *  delete:
   *     tags:
   *     - Post
   *     summary: Remove Post by id
   *     parameters:
   *      - name: id
   *        in: path
   *        description: The unique id of the Post
   *        required: true
   *     responses:
   *      200:
   *        description: Removed
   *      400:
   *        description: Bad request
   *      404:
   *        description: Not Found
   */
  app.route('/post/delete/:id').delete([isAuth, isAdmin], post.deletePost) // delete post
}
