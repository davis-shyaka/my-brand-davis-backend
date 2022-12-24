import express from 'express'
import mail from '../controllers/mailController.js'
import validates from '../middleware/validationMiddleware.js'
import { mailCreation } from '../middleware/validation/mailValidation.js'
import { isAuth, isAdmin } from '../middleware/authentication.js'

const router = express.Router()

/**
 * @swagger
 * /mail/all:
 *    get:
 *      tags: [mail routes]
 *      description: Returns all messages from our database
 *      responses:
 *        200:
 *          description: Get all posts from our API
 */
router.get('/mail/all', [isAuth, isAdmin], mail.allMail) // all mail

/**
 * @swagger
 * /mail/get/{mailId}:
 *    get:
 *      tags: [mail routes]
 *      summary: returns a one mail should provide mailId from our database
 *      parameters:
 *        - name: mailId
 *          in: path
 *          description: provide mailId
 *          required: true
 *      responses:
 *        200:
 *          description: success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/mail'
 *        404:
 *          description: not found
 */
router.get('/mail/get/:id', [isAuth, isAdmin], mail.getMail) // individual mail

/**
 * @swagger
 * /mail/create/:
 *   post:
 *     summary: Send a new message
 *     tags: [mail routes]
 *     requestBody:
 *       description: please fill all required fields
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMailInput'
 *     responses:
 *       '201':
 *         description: Created
 */
router.post('/mail/create', validates(mailCreation), mail.createMail) // create mail

/**
 * @swagger
 * /mail/delete/{mailId}:
 *    delete:
 *      tags: [mail routes]
 *      summary: deleting one message
 *      parameters:
 *        - name: mailId
 *          in: path
 *          description: provide mailId
 *          required: true
 *      responses:
 *        200:
 *          description: success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/mail'
 *        404:
 *          description: not found
 */
router.delete('/mail/delete/:id', [isAuth, isAdmin], mail.deleteMail) // delete mail

export default router
