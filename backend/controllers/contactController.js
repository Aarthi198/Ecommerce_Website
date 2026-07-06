const ContactMessage = require('../models/ContactMessage');
const sendEmail = require('../config/nodemailer');

const submitContact = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }

  const contactMessage = await ContactMessage.create({ name, email, message });

  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: 'New Threads & Trinkets Contact Message',
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong></p><p>${message}</p>`,
      text: `New contact message from ${name} <${email}>:\n\n${message}`,
    }).catch((error) => console.error('Contact email error:', error));
  }

  res.status(201).json({ message: 'Message received', contactMessage });
};

module.exports = {
  submitContact,
};
