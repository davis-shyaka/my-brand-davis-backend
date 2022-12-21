// Import API route
import postRouter from './routes/post.routes.js' // importing post route
import userRouter from './routes/user.routes.js' // importing user route
import commentRouter from './routes/comment.routes.js' // importing comment route
import mailRouter from './routes/mail.routes.js' // importing mail route
import swaggerDocs from './utils/swagger.js' // importing swagger docs

// import express
import express from 'express'

// our database connection
import db from './config/db.js'

// instantiate the db connection function
db()

// create express app
const app = express()

// define port to run express app
const port = process.env.PORT || 3000

// use json middleware on express app to be able to parse them in every single request.
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Add endpoint
app.get('/', (req, res) => {
  res.end('Saitama')
})

// Listen to server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
  swaggerDocs(app, port)
  app.use((req, res) => {
    res.status(404).json({
      message: "Route / page doesn't exist."
    })
  })
})

app.use(userRouter)
app.use(postRouter)
app.use(commentRouter)
app.use(mailRouter)

export default app
