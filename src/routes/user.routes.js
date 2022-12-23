import express from 'express'
import user from '../controllers/userController.js'
import validates from '../middleware/validationMiddleware.js'
import validation from '../middleware/validation/userValidation.js'
import { isAuth, isAdmin } from '../middleware/authentication.js'

const router = express.Router()

/**
 * @swagger
 * /user/all:
 *    get:
 *      tags: [user routes]
 *      description: Returns all users from our database
 *      responses:
 *        200:
 *          description: Get all users from our API
 */
router.get('/user/all', [isAuth, isAdmin], user.allUsers) // all users
/**
 * @swagger
 * /user/get/{userId}:
 *    get:
 *      tags: [user routes]
 *      summary: returns a one user should provide userId from our database
 *      parameters:
 *        - name: userId
 *          in: path
 *          description: provide userId
 *          required: true
 *      responses:
 *        200:
 *          description: success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/user'
 *        404:
 *          description: not found
 */
router.get('/user/get/:id', [isAuth, isAdmin], user.getUser) // individual user

/**
 * @swagger
 * /user/sign_up:
 *   post:
 *     summary: Create user account
 *     tags: [user routes]
 *     requestBody:
 *       description: Please fill all required fields
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       '201':
 *         description: Logged in successfully
 */
router.post('/user/sign_up', validates(validation.userSignUp), user.createUser) // create user

/**
 * @swagger
 * /user/log_in:
 *   post:
 *     summary: Login to your account
 *     tags: [user routes]
 *     requestBody:
 *       description: Please fill all required fields
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       '201':
 *         description: Logged in successfully
 */
router.post('/user/log_in', validates(validation.userSignIn), user.userSignIn) // user sign in
/**
 * @swagger
 * /user/log_out:
 *   post:
 *     summary: Logout to your account
 *     tags: [user routes]
 *     requestBody:
 *       description: Please fill all required fields
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       '201':
 *         description: Logged in successfully
 */
router.post('/user/log_out', isAuth, user.signOut) // user sign-out
/**
 * @swagger
 * /user/delete/{userId}:
 *    delete:
 *      tags: [user routes]
 *      summary: deleting one user
 *      parameters:
 *        - name: userId
 *          in: path
 *          description: provide userId
 *          required: true
 *      responses:
 *        200:
 *          description: success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/user'
 *        404:
 *          description: not found
 */
router.delete('/user/delete/:id', [isAuth, isAdmin], user.deleteUser) // delete user

export default router
