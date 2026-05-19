const nodemailer = require("nodemailer");

const sendFeedbackEmail = async (email, userName, feedback) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Feedback Received - ProductHub",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
            .header { background-color: #f97316; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 20px; }
            .feedback-info { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Feedback Received! 🙌</h1>
            </div>
            <div class="content">
                <p>Hi ${userName},</p>
                <p>Thank you for taking the time to give your feedback. We truly appreciate your input and are committed to improving our services based on your suggestions.</p>
                <div class="feedback-info">
                    <h3>Your Feedback</h3>
                    <p>${feedback}</p>
                </div>
                <p>Our team will review your feedback and may reach out if we need any further information. In the meantime, feel free to explore our latest products and offers!</p>
                <p>Best regards,<br/>The ProductHub Team</p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} ProductHub. All rights reserved.
            </div>
        </div>
    </body>
    </html>
  `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending feedback email:", error);
    throw error;
  }
};

module.exports = {
  sendFeedbackEmail,
};
