// const authorizeRoles = (...roles) => {
//     return (req, res, next) => {
//         // check if user role is allowed
//         if (!roles.includes(req.user.roles)) {
//             return res.status(403).json({
//                 message: "access denied. you do not have permission.",
            
//             })
//         }
//         next();
//     }
// }

// module.exports = authorizeRoles;