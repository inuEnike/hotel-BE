import axios from "axios";
import { Booking } from "../models/booking.model.js";
import { config } from "../utils/config.js";
import { sendBookingEmail } from "../utils/mailer.js";

export const PaymentController = {
  initializePayment: async (req, res, next) => {
    try {
      const { bookingId } = req.body;

      const booking = await Booking.findById(bookingId);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email: booking.guestEmail,
          amount: booking.totalAmount * 100, // kobo
          metadata: {
            bookingId: booking._id.toString(),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${config.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );

      return res.json({
        success: true,
        message: "Payment initialized",
        authorization_url: response.data.data.authorization_url,
        reference: response.data.data.reference,
      });
    } catch (err) {
      next(err);
    }
  },
  verifyPayment: async (req, res, next) => {
    try {
      const { reference } = req.body;

      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        },
      );

      const data = response.data.data;

      if (data.status !== "success") {
        return res.status(400).json({
          success: false,
          message: "Payment failed",
        });
      }

      const bookingId = data.metadata.bookingId;

      const booking = await Booking.findById(bookingId);

      if (!booking) {
        return res.status(404).json({
          message: "Booking not found",
        });
      }

      // prevent double update
      if (booking.paymentStatus === "Paid") {
        return res.json({
          success: true,
          message: "Already verified",
        });
      }

      booking.paymentStatus = "Paid";
      booking.bookingStatus = "Confirmed";

      await booking.save();
      await sendBookingEmail(booking);
      return res.json({
        success: true,
        message: "Payment verified",
        data: booking,
      });
    } catch (err) {
      next(err);
    }
  },
  paystackWebhook: async (req, res) => {
    try {
      const hash = crypto
        .createHmac("sha512", config.PAYSTACK_SECRET_KEY)
        .update(JSON.stringify(req.body))
        .digest("hex");

      const signature = req.headers["x-paystack-signature"];

      if (hash !== signature) {
        return res.sendStatus(400);
      }

      const event = req.body;

      if (event.event === "charge.success") {
        const data = event.data;

        const bookingId = data.metadata.bookingId;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
          return res.sendStatus(404);
        }

        if (booking.paymentStatus === "Paid") {
          return res.sendStatus(200);
        }

        booking.paymentStatus = "Paid";
        booking.bookingStatus = "Confirmed";

        await booking.save();

        await sendBookingEmail(booking);
      }

      res.sendStatus(200);
    } catch (err) {
      res.sendStatus(500);
    }
  },
};
