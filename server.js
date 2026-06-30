const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();


const connectDB = async () => {
    try{
        const connection = await mongoose.connect(process.env.MONGODB_URI);
        console.log(` MongoDB Connected: ${connection.connection.host}`);
    }
    catch (error) {
        console.error("database connection failed");
        console.error(error.message);
        process.exit(1);
    }
}

connectDB()

const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
    res.send("Hotel App is running...")
}); 

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  },
}));


app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});



const authRoutes = require("./routes/authRoutes")



app.use("/api/auth", authRoutes);

module.exports = connectDB;


module.exports = app; 
