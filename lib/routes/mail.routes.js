import mail from '../controllers/MailController.js'
import validates from '../middleware/validationMiddleware.js'
import { mailCreation } from '../middleware/validation/mailValidation.js'
import { isAuth, isAdmin } from '../middleware/Authentication.js'

// create App function
export default (app) => {
  // get and post requests for /mail endpoints
  app.route('/mail/all').get([isAuth, isAdmin], mail.allMail) // all mail
  app.route('/mail/get/:id').get([isAuth, isAdmin], mail.getMail) // individual mail
  app.route('/mail/create').post(validates(mailCreation), mail.createMail) // create mail

  // patch and delete request for /mail endpoints
  app.route('/mail/delete/:id').delete([isAuth, isAdmin], mail.deleteMail) // delete mail
}
