const nodemailer = require('nodemailer');
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const senderEmail = process.env.SENDER_EMAIL;
const appPassword = process.env.APP_PASSWORD;

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // use STARTTLS
    auth: {
      user: senderEmail,
      pass: appPassword,
    },
  });
  

const sendNewsletterEmail = async (subject, messageHtml) => {
  const recipientEmail = 'timothyshedrack11@gmail.com'; 

  const mailOptions = {
    from: `"Newsletter Bot" <${senderEmail}>`,
    to: recipientEmail,
    subject: subject || '📰 Your Monthly Newsletter',
    html: messageHtml || `
      <div style="font-family: Arial, sans-serif;">
        <h2>Hi there!</h2>
        <p>This is your default newsletter content.</p>
        <p>Stay tuned for more updates!</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Newsletter email sent:', info.response);
  } catch (error) {
    console.error('Error sending newsletter:', error);
    throw new Error("Newsletter email could not be sent");
  }
};

// Call the function here
sendNewsletterEmail(
  '📰 May Newsletter',
  `<div style="font-family: Arial, sans-serif;">
     <h2>Hello Subscriber!</h2>
     <p>Here's your May 2025 update. Lots of exciting things coming!</p>
   </div>`
);
