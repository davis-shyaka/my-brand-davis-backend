const { check, validationResult } = require("express-validator");

exports.validatePostCreation = [
  check("title")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Title cannot be empty")
    .isLength({ min: 3, max: 30 })
    .withMessage("Title must be 3 - 30 characters"),
  check("caption")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Caption cannot be empty")
    .isLength({ min: 3, max: 20 })
    .withMessage("Caption must be within 3 - 20 characters"),
  check("content")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Blog content cannot be empty")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters"),
];

exports.postValidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();
  else {
    const error = result[0].msg;
    res.json({ success: false, message: error });
  }
};
