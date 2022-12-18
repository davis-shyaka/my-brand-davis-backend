import Joi from "joi";

// validate mail creation
const schema = Joi.object({
  comment: Joi.string().trim().min(3).max(150).required(),
});

export { schema as commentCreation };
