const express = require("express");

const router = express.Router();

const{
    createReservation,
    getMyReservations,
    getReservationById,
    cancelReservation,
    checkInGuest,
    checkOutGuest,

} = require("../controllers/reservationController");

const {verifyToken, authorizeRoles} = require("../middleware/authMiddleware");

// create a reservation

router.post("/", verifyToken, createReservation);

// get logged in users reservations

router.get("/", verifyToken, getMyReservations);

// get a single reservation 
router.get("/:id", verifyToken, getReservationById);

// cancel a reservation
router.patch("/:id/cancel", verifyToken, cancelReservation);

// check in a guest
router.patch("/:id/check-in", verifyToken, authorizeRoles("admin"), checkInGuest );

// check out guest
router.post("/:id/check-out", verifyToken, authorizeRoles("admin"), checkOutGuest);

module.exports = router;