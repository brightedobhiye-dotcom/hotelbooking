const mongoose = require ("mongoose");
const reservationSchema = new mongoose.Schema({



   
    User :  {
        type: mongoose.Schema.Types.ObjectId,
        ref : "user",
        required: true
        
    },

    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "Room",
        required: true
    },

    checkInDate: {
        type: Date,
        required: true
    },

    checkOutDate : {
        type: Date,
        Required: true
    },

    totalPrice: {
        type: Number,
        required: true,
        min : 0
    }, 
    status : {
        type: String,
        enum : [ "Pending", "Confirmed", "Cancelled", "Completed"],
        default : "pending"
    
    },


   
    

   
},
{
    timestamps : true
}

)

const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;