import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  surname: {
    type: String,
    required: true
  },
  givenName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: String,

  role: {
    type: Number,
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  isAdmin: {
    type: Boolean,
    default: false
  }
})

userSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) return next(err)

      this.password = hash
      next()
    })
  }
})

userSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error('Password is missing; nothing to compare')
  try {
    const result = await bcrypt.compare(password, this.password)
    return result
  } catch (error) {
    console.log('Error while comparing the password: ', error.message)
  }
}

userSchema.statics.isThisEmailInUse = async function (email) {
  if (!email) throw new Error('Invalid Email')
  try {
    const user = await this.findOne({ email })
    if (user) return false
    return true
  } catch (error) {
    console.log('error inside isThisEmailInUse method: ', error.message)
    return false
  }
}

const User = mongoose.model('User', userSchema)
export default User
