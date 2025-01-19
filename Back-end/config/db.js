import sqlite3 from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url';

// Get the directory of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to the database file in the 'backend' folder
const dbName = path.join(__dirname, 'CMSdatabase.db');

const db = new sqlite3.Database(dbName, (error) => {
    if (error) {
        console.error('Error opening database:', error.message);
        return;
    }
    console.log(`Connected to the SQLite database: ${dbName}`);

    
    const sql = `
        CREATE TABLE IF NOT EXISTS CMS (
            id INTEGER PRIMARY KEY ,
            wordFirstLang TEXT ,
            sentenceFirstLang TEXT,
            wordSecondLang TEXT,
            sentenceSecondLang TEXT
        )
    `;
    db.run(sql, (err) => {
        if (err) {
            console.error('Error creating CMS table:', err.message);
        } else {
            console.log('CMS table is ready.');
        }
    });
});

export default db