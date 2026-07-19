const express = require("express");


const router = express.Router();

const {
    getAllRooms,
    getRoomById,
    createRoom,
    updateRoom,
    deleteRoom,
} = require("../controllers/roomController");

const {verifyToken, authorizeRoles} = require("../middleware/authMiddleware");
//const authorizeRoles = require("../middleware/roleMiddleware");

// Get all rooms
router.get("/", getAllRooms);

//Get a single room
router.get("/:id", getRoomById);

// create a room
router.post("/", verifyToken, authorizeRoles("admin"), createRoom);

// update a room
router.patch("/:id", verifyToken, authorizeRoles("admin"), updateRoom);

// delete room
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteRoom);

module.exports = router;