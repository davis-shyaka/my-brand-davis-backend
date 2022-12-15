const Joi = require("joi");

// validate mail creation
exports.commentCreation = Joi.object({
  comment: Joi.string().trim().min(3).max(150).required(),
});
