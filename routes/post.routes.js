import express from 'express'
import post from '../controllers/PostController.js'
import validates from '../middleware/validationMiddleware.js'
import { postCreation } from '../middleware/validation/PostValidation.js'
import { isAuth, isAdmin } from '../middleware/Authentication.js'

const router = express.Router()

/**
 * @swagger
 * /post/all:
 *    get:
 *      tags: [post routes]
 *      description: Returns all posts from our database
 *      responses:
 *        200:
 *          description: Get all posts from our API
 */
router.get('/post/all', post.allPosts) // all posts
/**
 * @swagger
 * /post/get/{postId}:
 *    get:
 *      tags: [post routes]
 *      summary: returns a one post should provide postId from our database
 *      parameters:
 *        - name: postId
 *          in: path
 *          description: provide postId
 *          required: true
 *      responses:
 *        200:
 *          description: success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/post'
 *        404:
 *          description: not found
 */
router.get('/post/get/:id', post.getPost) // individual post
/**
 * @swagger
 * /post/create/:
 *   post:
 *     summary: Create a new post
 *     tags: [post routes]
 *     requestBody:
 *       description: please fill all required fields
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInput'
 *     responses:
 *       '201':
 *         description: Created
 */
router.post(
  '/post/create',
  [isAuth, isAdmin, validates(postCreation)],
  post.createPost
) // create post

/**
 * @swagger
 * /post/update/{postId}:
 *   put:
 *     summary: Update a post only by admin
 *     tags: [post routes]
 *     parameters:
 *      - name: postId
 *        in: path
 *        description: provide postId
 *        required: true
 *     requestBody:
 *       description: please fill all required fields
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInput'
 *     responses:
 *       '201':
 *         description: Created successfully
 */
router.patch(
  '/post/update/:id',
  [isAuth, isAdmin, validates(postCreation)],
  post.updatePost
) // update post
/**
 * @swagger
 * /post/delete/{postId}:
 *    delete:
 *      tags: [post routes]
 *      summary: deleting one post
 *      parameters:
 *        - name: postId
 *          in: path
 *          description: provide postId
 *          required: true
 *      responses:
 *        200:
 *          description: success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/post'
 *        404:
 *          description: not found
 */
router.delete('/post/delete/:id', [isAuth, isAdmin], post.deletePost) // delete post

export default router
