import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    trim: true,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

export default commentSchema
