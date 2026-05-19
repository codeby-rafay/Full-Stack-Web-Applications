const nodemailer = require("nodemailer");

const sendFeedbackReplyEmail = async (
  email,
  userName,
  originalMessage,
  reply,
) => {
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
      subject: "Reply to Your Feedback - ProductHub",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
                .header { background-color: #f97316; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { padding: 20px; }
                .original-message { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #f97316; }
                .admin-reply { background-color: #ecfdf5; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #10b981; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>We've Replied to Your Feedback! 🎉</h1>
                </div>
                <div class="content">
                    <p>Hi ${userName},</p>
                    <p>Thank you for your feedback. Our team has reviewed it and sent you a response below:</p>
                    
                    <div class="original-message">
                        <h3>Your Message:</h3>
                        <p>${originalMessage}</p>
                    </div>

                    <div class="admin-reply">
                        <h3>Admin Reply:</h3>
                        <p>${reply}</p>
                    </div>

                    <p>If you have any further questions or concerns, please don't hesitate to reach out to us.</p>
                    <p>Best regards,<br/>The Product Hub Team</p>
                </div>
                <div class="footer">
                    &copy; ${new Date().getFullYear()} Product Hub. All rights reserved.
                </div>
            </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending feedback reply email:", error);
    throw error;
  }
};

module.exports = { sendFeedbackReplyEmail };
