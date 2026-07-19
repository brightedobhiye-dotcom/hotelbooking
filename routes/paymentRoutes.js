const express = require("express");

const router = express.Router();

const {
  initializePayment,
  verifyPayment,
  getMyPayments,
  getPaymentById,
} = require("../controllers/paymentController");

const {
  verifyToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// Initialize Paystack payment
router.post(
  "/initialize",
  verifyToken,
  initializePayment
);

// Verify payment
router.get(
  "/verify/:reference",
  verifyToken,
  verifyPayment
);

// Get logged-in user's payments
router.get(
  "/my-payments",
  verifyToken,
  getMyPayments
);

// Get a single payment
router.get(
  "/:id",
  verifyToken,
  getPaymentById
);

module.exports = router;