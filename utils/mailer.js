import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

export const sendBookingEmail = async (booking) => {
  try {
    const mailOptions = {
      from: `"Hotel Booking" <${process.env.EMAIL_USER}>`,
      to: booking.guestEmail,
      subject: "Booking Confirmed ✅",
      html: `
        <h2>Booking Confirmed</h2>
        <p>Hello ${booking.guestName},</p>

        <p>Your booking has been successfully confirmed.</p>

        <ul>
          <li><strong>Booking ID:</strong> ${booking._id}</li>
          <li><strong>Room:</strong> ${booking.roomId}</li>
          <li><strong>Check-in:</strong> ${new Date(booking.checkIn).toDateString()}</li>
          <li><strong>Check-out:</strong> ${new Date(booking.checkOut).toDateString()}</li>
          <li><strong>Total Paid:</strong> ₦${booking.totalAmount}</li>
        </ul>

        <p>We look forward to hosting you.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(" Email sent:", info.messageId);
  } catch (err) {
    console.error(" Email error:", err.message);
  }
};
