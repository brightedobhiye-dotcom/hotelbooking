const jwt = require("jsonwebtoken");

const User = require("../models/User");

const verifyToken = async (req, res, next) => {
    try {
        // get authorization header
        const authHeader = req.headers.authorization;

        //check if token exists
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                message: "Access denied. no token provided",
            })
        }

        // extract the token
        const token = authHeader.split(' ')[1];

        // verify the token

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // find the user and exclude the password

        const user = await User.findById(decoded.id).select("-password")

        if (!user) {
            return res.status(404).json({
                message: "user not found"
            })
        }
        // attach the user to the request
        req.user = user;

        // continue to the next middleware

    next()

    }
    catch(error) {
        return res.status(401).json({
            message: "invalid or expired token."
        })
    }
}


const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Check if req.user was successfully attached by verifyToken, and check their role
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied. You do not have permission to perform this action."
            });
        }
        next();
    };
};

module.exports = {
    verifyToken,
    authorizeRoles
};