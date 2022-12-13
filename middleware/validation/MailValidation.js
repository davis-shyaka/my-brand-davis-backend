const { check, validationResult } = require("express-validator");

exports.validateMailCreation = [
  check("name")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Name cannot be empty")
    .isString()
    .withMessage("This must be a real name")
    .isLength({ min: 3, max: 30 })
    .withMessage("Name must be 3 - 30 characters"),
  check("email").normalizeEmail().isEmail().withMessage("Invalid email"),
  check("subject")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Subject cannot be empty")
    .isLength({ min: 3, max: 30 })
    .withMessage("Subject must be 3 - 30 characters"),
  check("body")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Body cannot be empty")
    .isLength({ min: 3, max: 1400 })
    .withMessage("Body must be 3 - 1400 characters"),
];

exports.mailValidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.json({ success: false, message: error });
};
