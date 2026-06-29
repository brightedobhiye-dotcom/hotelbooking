const mongoose = require("mongoose");
const roomschema = new mongoose.Schema(
    {
        roomNumber: {
            type : String,
            required : true, 
            unique : true, 
            trim : true, 
        },

        roomType: {
            type: String,
            required : true,
            enum : ["Single", "Double", "Suite", "Deluxe"]
        },

        pricePerNight : {
            type: Number,
            required : true, 
            min : 0
        },

        Status : {
            type : String, 
            enum : ["Available", "Occupied", "Maintenance"],
            default : "Available"
        },

        images : {
            type : [String],
            default : []
        }


    }
)


const Room = mongoose.model("Room", roomSchema);

module.exports = Room;