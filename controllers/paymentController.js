const axios = require("axios");
const Payment = require("../models/payment");
const Reservation = require("../models/reservations");

// ===============================
// INITIALIZE PAYMENT
// ===============================
exports.initializePayment = async (req, res) => {
  try {
    const { reservationId } = req.body;

    // Find reservation
    const reservation = await Reservation.findById(reservationId)
      .populate("User")
      .populate("room");

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found",
      });
    }

    // Check ownership
    if (
      reservation.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not allowed to pay for this reservation",
      });
    }

    // Prevent duplicate payments
    const existingPayment = await Payment.findOne({
      reservation: reservation._id,
      status: "Successful",
    });

    if (existingPayment) {
      return res.status(400).json({
        message: "Reservation has already been paid for",
      });
    }

    // Generate unique reference
    const reference =
      "HOTEL_" +
      Date.now() +
      "_" +
      Math.floor(Math.random() * 10000);

    // Initialize Paystack
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: reservation.user.email,
        amount: reservation.totalPrice * 100,
        reference,
        metadata: {
          reservationId: reservation._id,
          roomNumber: reservation.room.roomNumber,
          guestName: reservation.user.name,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      message: "Payment initialized successfully",
      authorization_url:
        response.data.data.authorization_url,
      access_code: response.data.data.access_code,
      reference,
    });

  } catch (error) {
    res.status(500).json({
      message: error.response?.data || error.message,
    });
  }
};

// ===============================
// VERIFY PAYMENT
// ===============================
exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const paymentData = response.data;

    if (paymentData.status !== "success") {
      return res.status(400).json({
        message: "Payment was not successful",
      });
    }

    const reservationId =
      paymentData.metadata.reservationId;

    const reservation = await Reservation.findById(
      reservationId
    );

    if (!reservation) {
      return res.status(404).json({
        message: "Reservation not found",
      });
    }

    // Prevent duplicate verification
    const existingPayment = await Payment.findOne({
      paystackRef: reference,
    });

    if (existingPayment) {
      return res.status(400).json({
        message: "Payment has already been verified",
      });
    }

    // Save payment
    const payment = await Payment.create({
      reservation: reservation._id,
      user: reservation.user,
      amount: reservation.totalPrice,
      currency: paymentData.currency,
      status: "Successful",
      paymentMethod: "Paystack",
      paystackRef: reference,
    });

    // Update reservation
    reservation.status = "Confirmed";

    await reservation.save();

    res.status(200).json({
      message: "Payment verified successfully",
      payment,
    });

  } catch (error) {
    res.status(500).json({
      message: error.response?.data || error.message,
    });
  }
};

// ===============================
// GET MY PAYMENTS
// ===============================
exports.getMyPayments = async (req, res) => {
  try {

    const payments = await Payment.find({
      user: req.user._id,
    })
      .populate("reservation")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: payments.length,
      payments,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

// ===============================
// GET SINGLE PAYMENT
// ===============================
exports.getPaymentById = async (req, res) => {
  try {

    const payment = await Payment.findById(req.params.id)
      .populate("reservation");

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    const isOwner =
      payment.user.toString() === req.user._id.toString();

    const isAdmin =
      req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    res.status(200).json({
      payment,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};