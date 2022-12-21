import express from 'express'
import postRoutes from './post.routes.js'
const router = express.Router()

/**
 * @openapi
 * /healthcheck:
 *  get:
 *     tags:
 *     - Healthcheck
 *     description: Returns API operational status
 *     responses:
 *       200:
 *         description: API is  running
 */
router.get('/healthcheck', (req, res) => res.sendStatus(200))

router.use(postRoutes)

export default router
