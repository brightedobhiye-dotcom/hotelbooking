const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address']
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6 
  },
  role: { 
    type: String, 
    enum: ["guest", "admin", "receptionist"], 
    default: "guest" 
  },
  phone: { 
    type: String,
    trim : true,
    unique : true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Invalid phone number']
  },
  gender: { 
    type: String, 
    enum: ["male", "female", "other"] 
  },
  dob: { 
    type: Date 
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);


