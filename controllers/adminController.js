const User = require("../models/User");
const Room  = require("../models/rooms");
const Reservation = require("../models/reservations");
const Payment = require("../models/payment")

// DASHBOAD CONTROLLER

exports.getDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalRooms = await Room.countDocuments();
        const totalReservations = await Reservation.countDocuments();
        const totalPayments = await Payment.countDocuments();
        const availableRooms = await Room.countDocuments({ status: "Available", });
        
        const reservedRooms = await Room.countDocuments({ status: "Reserved", });
        const occupiedRooms = await Room.countDocuments({ status:"Occupied", });

        const revenue   = await Payment.aggregate([
            {
                $match: {
                    status: "Successful",
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue : { $sum: "$amount", },
                },
            },

        ])

        res.status(200).json({
            totalUsers,
            totalRooms,
            availableRooms,
            reservedRooms,
            occupiedRooms,
            totalReservations,
            totalPayments,
            totalRevenue : revenue.length > 0 ? revenue[0].totalRevenue : 0,
    


        });
        
        
    }
    catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
}



// GET ALL USERS

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}


// GET ALL RESERVATIONS

exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().populate("user", "name email").populate("room", "roomNumber roomType");
        res.status(200).json(reservations);
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

// GET ALL PAYMENTS

exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate({
            path : "reservation", 
            populate : {
                path: "user", 
                select: "name email",
            },
        })

        res.status(200).json(payments);
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}