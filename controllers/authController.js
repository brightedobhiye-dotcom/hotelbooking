const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
    return jwt.sign(
        { id, role},
        process.env.JWT_SECRET,
        { expiresIn : "3d"}
    );
};

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, phone} = req.body;

    const existingUser = await User.findOne({ email});
    
    if (existingUser) {
        return res.status(400).json({
            message: "user already exists"
        })
    }

    const salt = await bcrypt.gensalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
    });

    res.status(201).json({
        message: "Registration Successful",
        token: generateToken(user._id, user.role),
        user,
    });
    }    

catch (error) {
    res.status(500).json({
        message: error.message,
    });

}

}

exports.loginUser = async (req, res) => {
    try{
        const { email, password} = req.body; 

        // check if the user exists
        const user = await User.findOne ({ email });

        if (!user) {
            return res.status(400).json({
                message: "invalid email or password", 
            })
        }

        // compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "invalid email or password",
            })
        }

        // send a successful response
        res.status(200).json({
            message: "login successful",
            token: generateToken(user._id, user.role),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
            }
        })
    }

catch (error) {
    res.status(500).json({
        message: error.message,
    });
}            
        
     
}


