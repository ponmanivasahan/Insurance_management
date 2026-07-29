const db = require("../config/db");

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Access Denied. User not authenticated."
            });
        }
        
        db.query(
            "SELECT role FROM users WHERE id = ?",
            [req.user.id],
            (err, results) => {
                if (err) {
                    return res.status(500).json({
                        message: "Database error during role authorization"
                    });
                }
                if (results.length === 0) {
                    return res.status(404).json({
                        message: "User not found"
                    });
                }
                
                const userRole = results[0].role;
                if (!roles.includes(userRole)) {
                    return res.status(403).json({
                        message: "Access Forbidden"
                    });
                }
                
                req.user.role = userRole;
                next();
            }
        );
    };
};

module.exports = authorizeRoles;