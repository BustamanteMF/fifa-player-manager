const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret';

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token missing' });
        }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        // If token expired, return a specific error code so frontend can react (refresh / re-login)
        if (error && error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'token_expired', message: error.message });
        }
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;
