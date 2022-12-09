const { check, validationResult } = require("express-validator");

exports.validateUserSignUp = [
  check("surname")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name cannot be empty")
    .isString()
    .withMessage("This must be a real name")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be 3 - 20 characters"),
  check("givenName")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name cannot be empty")
    .isString()
    .withMessage("This must be a real name")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be within 3 - 20 characters"),
  check("email").normalizeEmail().isEmail().withMessage("Invalid email"),
  check("password")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 7, max: 20 })
    .withMessage("Password must be 7 - 20 characters"),
  check("confirmPassword")
    .trim()
    .not()
    .isEmpty()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

exports.userValidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.json({ success: false, message: error });
};

exports.validateUserSignIn = [
  check("email").trim().isEmail().withMessage("Email is required"),
  check("password").trim().not().isEmpty().withMessage("Password is required"),
];
