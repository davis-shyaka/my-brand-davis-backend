import postRouter from './src/routes/post.routes.js' // importing post route
import userRouter from './src/routes/user.routes.js' // importing user route
import commentRouter from './src/routes/comment.routes.js' // importing comment route
import mailRouter from './src/routes/mail.routes.js' // importing mail route
import swaggerDocs from './src/utils/swagger.js' // importing swagger docs
import cors from 'cors' // importing cors

// import express
import express from 'express'

// our database connection
import db from './src/config/db.js'

// instantiate the db connection function
db()

// create express app
const app = express()

// define port to run express app
const PORT = process.env.PORT || 3000

// use json middleware on express app to be able to parse them in every single request.
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// creating an instance of cors with express app instance
app.use(cors())

// Add endpoint
app.get('/', (req, res) => {
  res.end('Welcome: Please use the /docs endpoint to test the api')
})

// Listen to server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
  swaggerDocs(app, PORT)
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
