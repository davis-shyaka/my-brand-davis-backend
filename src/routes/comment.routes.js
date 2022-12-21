import express from 'express'
import comment from '../controllers/commentController.js'
import validates from '../middleware/validationMiddleware.js'
import { commentCreation } from '../middleware/validation/commentValidation.js'
import { isAuth, isAdmin } from '../middleware/authentication.js'

const router = express.Router()

router.get('/comment/all', comment.allComments) // all comments
router.get('/comment/get/:id', [isAuth, isAdmin], comment.getComment) // individual comment
router.post(
  '/comment/create/on/post/:id',
  [isAuth, validates(commentCreation)],
  comment.createComment
) // create comment
router.delete('/comment/delete/:id', [isAuth, isAdmin], comment.deleteComment) // delete comment

export default router
