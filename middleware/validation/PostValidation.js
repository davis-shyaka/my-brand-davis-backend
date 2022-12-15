const Joi = require("joi");

// validate user sign up
exports.postCreation = Joi.object({
  title: Joi.string().trim().min(3).max(30).required(),

  caption: Joi.string().trim().min(3).max(30).required(),

  content: Joi.string().trim().min(30).max(2500).required(),
});
