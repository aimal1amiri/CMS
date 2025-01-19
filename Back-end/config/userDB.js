import sqlite3 from 'sqlite3';
import path from 'path'
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const dbName = path.join(__dirname, 'userDB.db');



const userDB = new sqlite3.Database(dbName, (error) => {
    if (error) {
        console.error('Error opening database:', error.message);
        return;
    }
    console.log(`Connected to the SQLite database: ${dbName}`);

   
    const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            token TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;

    userDB.run(sql, (err) => {
        if (err) {
            console.error('Error creating users table:', err.message);
        } else {
            console.log('Users table is ready.');
        }
    });
});

export default userDB;
