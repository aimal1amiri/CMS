import userDB from '../config/userDB.js';

export const signout = (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];  

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token is required for logout',
        });
    }

   
    const query = `UPDATE users SET token = NULL WHERE token = ?`;

    userDB.run(query, [token], function (err) {
        if (err) {
            console.error('Error during logout:', err.message);
            return res.status(500).json({
                success: false,
                message: 'Server error while logging out',
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'Token not found or already logged out',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Logout successful',
        });
    });
};
