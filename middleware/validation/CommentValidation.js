const { check, validationResult } = require("express-validator");

exports.validateCommentCreation = [
  check("comment")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Comment cannot be empty")
    .isString()
    .withMessage("This must be a real comment")
    .isLength({ min: 3, max: 30 })
    .withMessage("comment must be 3 - 250 characters"),
];

exports.commentValidation = (req, res, next) => {
  const result = validationResult(req).array();
  if (!result.length) return next();

  const error = result[0].msg;
  res.json({ success: false, message: error });
};
