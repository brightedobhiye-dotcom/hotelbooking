const express  = require("express");
const router = express.Router();
const {verifyToken, authorizeRoles} = require("../middleware/authMiddleware");


const {
    getDashboard,
    getAllUsers,
    getAllReservations,
    getAllPayments,
} = require("../controllers/adminController"); 

// dashboard 
router.get("/dashboard",
    verifyToken,
    authorizeRoles("admin"),
    getDashboard

);

// USERS 
router.get("/Users",
    verifyToken,
    authorizeRoles("admin"),
    getAllUsers
);

// RESERVATIONS
router.get("/reservations",
    verifyToken, 
    authorizeRoles("admin"),
    getAllReservations
);

// PAYMENTS
router.get("/payments",
    verifyToken, 
    authorizeRoles("admin"),
    getAllPayments
);


module.exports = router;