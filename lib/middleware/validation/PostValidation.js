import Joi from 'joi'

/**
 * @openapi
 * components:
 *  schemas:
 *    CreatePostInput:
 *      type: object
 *      required:
 *        - title
 *        - caption
 *        - content
 *      properties:
 *        title:
 *          type: string
 *          default: Still can't believe this is all real
 *        caption:
 *          type: string
 *          default: Still trying to decide how I feel
 *        content:
 *          type: string
 *          default: Still don't really need them
 *    CreatePostResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *        data:
 *          type: object
 *          properties:
 *            title:
 *              type: string
 *            caption:
 *              type: string
 *            content:
 *              type: string
 *            createdAt:
 *              type: string
 *            updatedAt:
 *              type: string
 *            _id:
 *              type: string
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    post:
 *      type: object
 *      required:
 *        - title
 *        - caption
 *        - content
 *      properties:
 *        title:
 *          type: string
 *        caption:
 *          type: string
 *        content:
 *          type: string
 */
const schema = Joi.object({
  title: Joi.string().trim().min(3).max(30).required(),

  caption: Joi.string().trim().min(3).max(30).required(),

  content: Joi.string().trim().min(30).max(2500).required()
})

export { schema as postCreation }
