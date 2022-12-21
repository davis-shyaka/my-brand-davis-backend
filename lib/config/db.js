import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

// Connect to mongoose
mongoose.set('strictQuery', true)
const db = async () => {
  await mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log('database is connected')
    })
    .catch((err) => console.log(err.message))
}
export default db
