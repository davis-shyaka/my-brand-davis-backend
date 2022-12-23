import Joi from 'joi'

const schema = Joi.object({
  title: Joi.string().trim().min(3).max(30).required(),

  caption: Joi.string().trim().min(3).max(30).required(),

  content: Joi.string().trim().min(30).max(2500).required()
})

export { schema as postCreation }
