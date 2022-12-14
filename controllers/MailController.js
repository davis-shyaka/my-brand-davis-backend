const Mail = require("../models/MailModel");

// Get all mail
exports.allMail = async (req, res) => {
  try {
    const mail = await Mail.find();
    res.status(200).json(mail);
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get individual mail
exports.getMail = async (req, res) => {
  try {
    let mail = await Mail.findOne({ _id: req.params.id });
    if (!mail) {
      res.status(404).send({ success: false, message: "Mail doesn't exist!" });
    } else res.status(200).json(mail);
  } catch (error) {
    res.status(404).send({ success: false, message: error.message });
  }
};

// create a new message
exports.createMail = async (req, res) => {
  try {
    let newMail = new Mail(req.body);
    await newMail.save();
    res.status(201).json(newMail);
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: `Error sending mail: ${error.message}`,
      });
  }
};

// Delete mail
exports.deleteMail = async (req, res) => {
  try {
    const mail = await Mail.findOne({ _id: req.params.id });
    if (!mail) {
      res.status(404).json({ success: false, message: "Mail doesn't exist!" });
    } else {
      await mail.deleteOne();
      res
        .status(200)
        .json({ success: true, message: "Mail successfully deleted", mail });
    }
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
