import Mail from '../models/mailModel.js'

// Get all mail
const allMail = async (req, res) => {
  try {
    const mail = await Mail.find()
    res.status(200).json({ statusCode: 200, success: true, data: [...mail] })
  } catch (error) {
    res.json({
      statusCode: 505,
      success: false,
      data: [{ message: error.message }]
    })
  }
}

// Get individual mail
const getMail = async (req, res) => {
  try {
    const mail = await Mail.findOne({ _id: req.params.id })
    if (!mail) {
      res.status(404).send({
        statusCode: 404,
        success: false,
        data: [{ message: "Mail doesn't exist!" }]
      })
    } else {
      res.status(200).json({ statusCode: 200, success: true, data: [mail] })
    }
  } catch (error) {
    res.status(404).send({
      statusCode: 404,
      success: false,
      data: [{ message: error.message }]
    })
  }
}

// create a new message
const createMail = async (req, res) => {
  try {
    const newMail = new Mail(req.body)
    await newMail.save()
    res.status(201).json({ statusCode: 201, success: true, data: [newMail] })
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      success: false,
      data: [{ message: `Error sending mail: ${error.message}` }]
    })
  }
}

// Delete mail
const deleteMail = async (req, res) => {
  try {
    const mail = await Mail.findOne({ _id: req.params.id })
    if (!mail) {
      res.status(404).json({
        statusCode: 404,
        success: false,
        data: [{ message: "Mail doesn't exist!" }]
      })
    } else {
      await mail.deleteOne()
      res.status(200).json({
        statusCode: 200,
        success: true,
        data: [{ message: 'Mail successfully deleted', body: mail }]
      })
    }
  } catch (error) {
    res.status(404).json({
      statusCode: 404,
      success: false,
      data: [{ message: error.message }]
    })
  }
}
export default { allMail, getMail, createMail, deleteMail }
