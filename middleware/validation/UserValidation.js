const Joi = require("joi");

// validate user sign up
exports.userSignUp = Joi.object({
  surname: Joi.string().trim().min(3).max(30).required(),

  givenName: Joi.string().trim().min(3).max(30).required(),

  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base": `Password should be at least 8 characters long, contain at least 1 uppercase, 1 lowercase, 1 digit, and one special case character.`,
      "string.empty": `Password cannot be empty`,
      "any.required": `Password is required`,
    }),

  confirm_password: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords must match",
  }),

  access_token: [Joi.string(), Joi.number()],

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
})
  .with("username", "givenName")
  .xor("password", "access_token")
  .with("password", "confirm_password");

// validate user sign in
exports.userSignIn = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().required(),
}).with("email", "password");
