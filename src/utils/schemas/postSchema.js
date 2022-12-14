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
 *          default: Still can't believe
 *        caption:
 *          type: string
 *          default: Still trying
 *        content:
 *          type: string
 *          default: Still can't believe this is all real. Still trying to figure out how I feel. Still don't really need them
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
