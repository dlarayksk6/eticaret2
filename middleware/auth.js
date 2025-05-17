const jwt = require('jsonwebtoken');
const pool = require('../db');

exports.authenticate = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({ message: 'Not authorized to access this route' });
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.id]);
            if (rows.length === 0) {
                return res.status(401).json({ message: 'Not authorized to access this route' });
            }
            req.user = rows[0];
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Not authorized to access this route' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error in authentication middleware' });
    }
};


exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

module.exports = {
    authenticate: exports.authenticate,
    authorize: exports.authorize
}; 