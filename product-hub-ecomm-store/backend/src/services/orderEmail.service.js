const nodemailer = require("nodemailer");

// Setup email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Email template for order placed
function orderPlacedEmail(userName, userEmail, order) {
  const isCOD = order.paymentMethod === "cod";
  const orderDate = new Date(order.timestamp).toLocaleDateString();

  const productsList = order.products
    .map(
      (p) =>
        `<tr>
        <td style="padding: 10px; border: 1px solid #ddd;">${p.name}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">Qty: ${p.quantity}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">$ ${p.price}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">$ ${p.price * p.quantity}</td>
      </tr>`,
    )
    .join("");

  const paymentMessage = isCOD
    ? "<p style='color: #d97706; font-weight: bold;'>💵 Keep your cash ready! Your order will reach soon. Our delivery partner will collect payment on delivery.</p>"
    : "<p style='color: #16a34a; font-weight: bold;'>✅ Thank you for your payment! Your order will be delivered soon.</p>";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { background-color: #f97316; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { padding: 20px; }
        .order-info { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
        table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        th { background-color: #f3f4f6; padding: 10px; text-align: left; border: 1px solid #ddd; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmed! 🎉</h1>
        </div>
        <div class="content">
          <p>Hi ${userName},</p>
          
          <p>Your order has been successfully placed. Thank you for shopping with us!</p>

          <div class="order-info">
            <h3>Order Details</h3>
            <p><strong>Order ID: </strong>${String(order._id).slice(-8).toUpperCase()}</p>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Shipping Address:</strong> ${order.shippingAddress}</p>
          </div>

          <h3>Products Ordered</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${productsList}
            </tbody>
          </table>

          <div class="order-info">
            <h3>Order Summary</h3>
            <p><strong>Total Items:</strong> ${order.totalItems}</p>
            <p><strong>Total Amount:</strong> $ ${order.totalAmount}</p>
            <p><strong>Payment Method:</strong> ${isCOD ? "Cash on Delivery (COD)" : "Card Payment"}</p>
          </div>

          ${paymentMessage}

          <div style="background-color: #efe4; padding: 15px; border-left: 4px solid #f97316; margin: 15px 0;">
            <p><strong>📱 Track Your Order:</strong></p>
            <p>You will receive live updates about your order status in the app notifications. Track your order status anytime by visiting the <strong>Notifications</strong> page in your account.</p>
          </div>

          <p>If you have any questions, please contact our support team.</p>
          <p>Best regards,<br><strong>ProductHub Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

// Email template for order status update
function orderStatusUpdateEmail(
  userName,
  userEmail,
  order,
  newStatus,
  previousStatus,
) {
  const statusMessages = {
    confirmed: "Your order has been confirmed! 🎉",
    shipped: "Your order is on the way! 🚚",
    delivered: "Your order has been delivered! 📦",
    cancelled: "Your order has been cancelled ❌",
  };

  const detailedMessages = {
    confirmed:
      "Our team has confirmed your order. You will receive shipping updates soon.",
    shipped:
      "Your package is on its way to you. Track it in the app notifications.",
    delivered:
      "Your order has been successfully delivered. Thank you for your purchase!",
    cancelled:
      "Your order has been cancelled. Your payment will be refunded within 5-7 business days.",
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
        .header { background-color: #f97316; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .status-info { background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${statusMessages[newStatus]}</h1>
        </div>
        <div class="content" style="padding: 20px;">
          <p>Hi ${userName},</p>
          
          <p>${detailedMessages[newStatus]}</p>

          <div class="status-info">
            <h3>Order Update</h3>
            <p><strong>Order ID: </strong>${String(order._id).slice(-8).toUpperCase()}</p>
            <p><strong>Current Status:</strong> ${newStatus}</p>
            <p><strong>Previous Status:</strong> ${previousStatus}</p>
            <p><strong>Order Amount:</strong> $ ${order.totalAmount}</p>
          </div>

          ${
            newStatus === "cancelled"
              ? `
            <div style="background-color: #fef3c7; padding: 15px; border-left: 4px solid #f97316; margin: 15px 0;">
              <h4>Refund Information:</h4>
              <p>Since your order has been cancelled, your payment will be refunded to your original payment method within 5-7 business days.</p>
              <p>If you paid via card, the refund will appear in your bank account.</p>
              <p>If you chose Cash on Delivery, there's nothing to refund.</p>
            </div>
          `
              : ""
          }

          <p>📱 Check the app notifications for real-time updates.</p>
          <p>If you have any questions, please contact our support team.</p>
          <p>Best regards,<br><strong>ProductHub Team</strong></p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

async function sendEmail(toEmail, subject, htmlContent) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error || new Error("Failed to send email");
    return false;
  }
}

module.exports = {
  sendEmail,
  orderPlacedEmail,
  orderStatusUpdateEmail,
};
