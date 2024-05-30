const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
    });
    

async function sendEmail(email, subject, text, html) {
  try {
    // Send email
    await transporter.sendMail({
      from: 'recrutement@xsustain.io',
      to: email,
      subject: subject,
      text: text,
      html: html
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

module.exports = {
  sendEmail
};
