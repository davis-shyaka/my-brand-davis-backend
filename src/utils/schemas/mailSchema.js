/**
 * @openapi
 * components:
 *  schemas:
 *    CreateMailInput:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - subject
 *        - message
 *      properties:
 *        name:
 *          type: string
 *          default: reigen arataka
 *        email:
 *          type: string
 *          default: reigen@spiritsandsuch.com
 *        subject:
 *          type: string
 *          default: Mob is missing
 *        message:
 *          type: string
 *          default: Lend me money
 *    CreateMailResponse:
 *      type: object
 *      properties:
 *        message:
 *          type: string
 *        data:
 *          type: object
 *          properties:
 *            name:
 *              type: string
 *            email:
 *              type: string
 *            subject:
 *              type: string
 *            message:
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
 *    mail:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - subject
 *        - message
 *      properties:
 *        name:
 *          type: string
 *        email:
 *          type: string
 *        subject:
 *          type: string
 *        message:
 *          type: string
 */
