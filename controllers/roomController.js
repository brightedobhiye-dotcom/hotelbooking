const Room = require("../models/rooms");

// Create a new room
exports.createRoom = async (req, res) => {
    try{
        const {
            roomNumber, 
            roomType,
            pricePerNight,
            capacity,
            description,
            amenities,
            status,
            images,
        } = req.body; 

        const existingRoom = await Room.findOne({ roomNumber});

        if (existingRoom) {
            return res.status(400).json({
                message: "room number already exists.",
            });
        }


        const room = await Room.create({
            roomNumber, 
            roomType,
            pricePerNight,
            capacity,
            description,
            amenities,
            status,
            images,
        });

        res.status(201).json({
            message: "room created successfully", room,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}

// get all rooms
exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();

        res.status(200).json({
            count: rooms.length,
            rooms,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    };
};

// get a single room
exports.getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);

        if (!room) {
            return res.status(404).json({
                message: "room not found",
            });
        }

        res.status(200).json({
            room,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
}


// update a room
exports.updateRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(
            req.params.id, req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!room) {
            return res.status(404).json({
                message: "room not found",
            });
        }

        res.status(200).json({
            message: "room updated successfully", room,
        });
    } 
    catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
};

//delete a room
exports.deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);

        if (!room) {
            return res.status(404).json({
                message: "room not found",
            })
        }

        res.status(200).json({
            message: "room deleted successfully",
        })
    }
    catch (error) {
        res.status(500).json({
            message: error.message,
        })
    }
}