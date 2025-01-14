import sqlite3 from 'sqlite3'

const dbName='CMSdatabase.db'

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