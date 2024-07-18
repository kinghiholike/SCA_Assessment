const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Configure dotenv
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || '1234567890';

// Middleware to authenticate user using JWT
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Access denied' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Token has expired' });
        }
        return res.status(403).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateUser;
