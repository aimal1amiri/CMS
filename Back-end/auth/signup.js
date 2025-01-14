import userDB from '../config/userDB.js';
import bcrypt from 'bcrypt';

export const signup = async (req, res) => {
    const { username, password, email } = req.body;

    
    if (!username || !password || !email) {
        return res.status(400).json({
            success: false,
            message: 'All fields username, password, email are required',
        });
    }

    try {
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

         
        const query = `
            INSERT INTO users (username, password, email)
            VALUES (?, ?, ?)
        `;

        userDB.run(query, [username, hashedPassword, email], function (err) {
            if (err) {
              
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({
                        success: false,
                        message: 'Username or email already exists',
                    });
                }
                console.error('Error inserting user:', err.message);
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error',
                });
            }

      
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                
                
            });
        });
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
