import userDB from '../config/userDB.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your_secret_key'; 

export const signin = async (req, res) => {
    const { username, password } = req.body;

     
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'Both username and password are required',
        });
    }

    try {
         
        const query = `SELECT * FROM users WHERE username = ?`;
        userDB.get(query, [username], async (err, user) => {
            if (err) {
                console.error('Error fetching user:', err.message);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found',
                });
            }

             
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials',
                });
            }

             
            const token = jwt.sign(
                { userId: user.id, username: user.username },
                JWT_SECRET,
                { expiresIn: '1h' } 
            );

           
            const updateTokenQuery = `UPDATE users SET token = ? WHERE id = ?`;
            userDB.run(updateTokenQuery, [token, user.id], (updateErr) => {
                if (updateErr) {
                    console.error('Error saving token:', updateErr.message);
                }
            });

            
            res.status(200).json({
                success: true,
                message: 'Login successful',
                token
                
            });
        });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
