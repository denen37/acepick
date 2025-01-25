const nodemailer = require('nodemailer');
require('dotenv').config();



const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false  // Disable certificate validation
    }
});

export async function sendEmail(to: String, subject: String, text: String | null, html: String | null) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    try {
        const info = await transporter.sendMail(mailOptions);

        return {
            success: true,
            message: 'Email sent successfully',
            messageId: info.messageId,
        };
    } catch (error) {

        return {
            success: false,
            message: 'Failed to send email',
            error: error
        }
    }
}

module.exports = {
    sendEmail
}