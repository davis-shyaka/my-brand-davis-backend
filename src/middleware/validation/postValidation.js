import Joi from 'joi'

const schema = Joi.object({
  title: Joi.string().trim().required(),

  caption: Joi.string().trim().required(),

  content: Joi.string().trim().required()
})

export { schema as postCreation }
