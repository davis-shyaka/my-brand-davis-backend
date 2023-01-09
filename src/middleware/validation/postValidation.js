import Joi from 'joi'

const schema = Joi.object({
  cover: Joi.string().trim(),

  title: Joi.string().trim().required(),

  caption: Joi.string().trim().required(),

  content: Joi.string().trim().required()
})

export { schema as postCreation }
