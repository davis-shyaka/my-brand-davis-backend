import Joi from "joi";

// validate mail creation
const schema = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),

  subject: Joi.string().trim().min(3).max(30).required(),

  message: Joi.string().trim().min(10).max(500).required(),
})
  .with("name", "email")
  .with("subject", "message");

export { schema as mailCreation };
