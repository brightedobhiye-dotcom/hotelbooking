const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
    reservation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reservation",
        required: true 
    },

    amount: {
        type: Number,
        required: true,
        min: 0, 
    }, 

    currency: {
        type: String, 
        default: "NGN"
    }, 

    transactionreference: {
        type: String, 
        required: true, 
        unique: true
    },

    status: {
        type: String,
        enum : ["Pending", "Successful", "Failed", "Refunded"],
        default: "Pending"
    },

    paymentChannel: {
        type: String
    }, 

    gatewayResponse: {
        type: String
    }, 

    paymentDate: {
        type: Date, 
        default: Date.now
    },

   



},
{
     timestaps: true, 
}
)

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment