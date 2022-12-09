const Mail = require("../models/MailModel");

// Get all mail
exports.allMail = async (req, res) => {
  try {
    const mail = await Mail.find();
    res.json({ success: true, message: "All Mail: ", mail });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// create a new message
exports.createMail = async (req, res) => {
  const { name, email, subject, body } = req.body;

  const mail = await Mail({
    name,
    email,
    subject,
    body,
  });
  await mail.save();
  res.json({ success: true, message: "Mail sent successfully", mail });
};

// Delete mail
exports.deleteMail = async (req, res) => {
  try {
    const mail = await Mail.findOne({ _id: req.params.id });
    await mail.remove();
    res.json({ success: true, message: "Mail deleted succesfully", mail });
  } catch (error) {
    res.status(404);
    res.json({
      success: false,
      message: "Mail couldn't be deleted.",
    });
    console.log("Error deleting mail: ", error.message);
  }
};
