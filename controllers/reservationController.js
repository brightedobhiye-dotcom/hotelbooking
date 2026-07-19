const Reservation = require("../models/reservations");
const Room = require("../models/rooms");


exports.createReservation = async (req, res) => {
    try {
        const { roomId, checkInDate, checkOutDate} = req.body;

        // check if all fields are provided

        if (!roomId || !checkInDate || !checkOutDate) {
            return res.status(400).json({
                 message: "room, check in date and check out date are required"
            })
        }

        // find the room
        const room = await Room.findById(roomId);

        if (!room) {
            return res.status(404).json({
                message: "room not found",
            })
        }

        // Convert dates
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        // chack dates
        if (checkOut <= checkIn) {
            return res.status(400).json({
                message: "check out date must be after check in date",
            });
        }

        // check for exixting reservation
        const existingReservation = await Reservation.findOne({
            room: roomId,
            status: {
                $in: ["Pending", "Confirmed", "Checked In"],
            },
            checkInDate: {
                $lt: checkOut,
            },
            checkOutDate: {
                $gt: checkIn,
            },

        });

        if (existingReservation) {
            return res.status(400).json({
                messsage: "room is already reserved for the selected dates",
            });
        }

        // calculate number of nights
        const timeDifference = checkOut - checkIn;
        const numberOfNights = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        // calculate total price
        const totalPrice = numberOfNights * room.pricePerNight;

        // create reservation
        const reservation = await Reservation.create({
            user: req.user._id,
            room: roomId,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            numberOfNights,
            totalPrice,
            status: "Pending",
        })
        res.status(201).json({
            message: "reservation created successfully. please complete payment.", reservation,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


//GET MY RESERVATIONS
exports.getMyReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ 
            user: req.user._id,
        }).populate("room", "roomNumber roomType pricePerNight status");
            
        

        res.status(200).json({
            count: reservations.length, reservations,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}



// GET ONE RESERVATION
exports.getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(
            req.params.id
        ).populate("room", "roomNumber roomType pricePerNight");
        
        if (!reservation) {
            return res.status(404).json({
                message: "reservation not found",
            });
        }

        const isOwner = reservation.user.toString() === req.user._id.toString();
        
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: "you are not allowed to view this reservation",
            });
        }

        res.status(200).json({
            reservation,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}


// CANCEL RESERVATION
exports.cancelReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                message: "reservation not found", 
            });
        }

        const isOwner = reservation.user.toString() === req.user._id.toString();

        const isAdmin = req.user.role === "admin";


        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: "you are not allowed to cancel this reservation",
            });
        }

        if (
            reservation.status === "Checked In" ||
            reservation.status === "Checked out" ||
            reservation.status === "Cancelled"
        ) {
            return res.status(400).json({
                message: `Reservation cannot be cancelled because it is ${reservation.status}`,

            });
        }

        reservation.status = "Cancelled";

        await reservation.save();

        res.status(200).json({
            message: "Reservation cancelled successfully", reservation,
        });

    

    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}


// CHECK IN GUEST

exports.checkInGuest = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                message: "Reservation not found",
            });
        }
        
        if (reservation.status !== "Confirmed") {
            return res.status(400).json({
                message: "Only confirmed reservations can be checked in",
            });
        }

        reservation.status = "Checked In";

        await reservation.save();

        await Room.findByIdAndUpdate(reservation.room, { status: "Occupied",});

        res.status(200).json({
            message: "guest checked in successfully", reservation,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}




// CHECK OUT GUEST

exports.checkOutGuest = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                message: "reservation not found", reservation,
            });
        }

        if (reservation.status !== "Checked In") {
            return res.status(400).json({
                message: "guest must be checked in before checkout",
            });
        }

        reservation.status = "Checked Out";

        await reservation.save();

        await Room.findByIdAndUpdate(reservation.room, {status: "Available", })

        res.status(200).json({
            message: "Guest checked out successfully", reservation, 
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}