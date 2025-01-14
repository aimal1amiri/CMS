import jwt from 'jsonwebtoken';
import userDB from '../config/userDB.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';  

export const authWall = (req, res, next) => {
    
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token is required',
        });
    }

     
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token',
            });
        }

         
        const query = `SELECT * FROM users WHERE token = ?`;
        userDB.get(query, [token], (dbErr, row) => {
            if (dbErr) {
                console.error('Error verifying token in database:', dbErr.message);
                return res.status(500).json({
                    success: false,
                    message: 'Server error',
                });
            }

            if (!row) {
                return res.status(403).json({
                    success: false,
                    message: 'Token is invalid or revoked',
                });
            }

             
            req.user = { id: row.id, username: row.username, email: row.email };
            next();  
        });
    });
};
