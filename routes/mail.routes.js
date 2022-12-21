import express from 'express'
import mail from '../controllers/mailController.js'
import validates from '../middleware/validationMiddleware.js'
import { mailCreation } from '../middleware/validation/mailValidation.js'
import { isAuth, isAdmin } from '../middleware/authentication.js'

const router = express.Router()

router.get('/mail/all', [isAuth, isAdmin], mail.allMail) // all mail
router.get('/mail/get/:id', [isAuth, isAdmin], mail.getMail) // individual mail
router.post('/mail/create', validates(mailCreation), mail.createMail) // create mail

// patch and delete request for /mail endpoints
router.delete('/mail/delete/:id', [isAuth, isAdmin], mail.deleteMail) // delete mail

export default router
