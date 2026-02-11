const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        service: 'gmail', // You can use other services like 'SendGrid', 'Mailgun', etc.
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    // Send mail with defined transport object
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: options.html // Optional: Use HTML for better email formatting
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
