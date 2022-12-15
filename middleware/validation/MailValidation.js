const Joi = require("joi");

// validate mail creation
exports.mailCreation = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),

  subject: Joi.string().trim().min(3).max(30).required(),

  body: Joi.string().trim().min(10).max(500).required(),
})
  .with("name", "email")
  .with("subject", "body");
