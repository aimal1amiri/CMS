import db from "../config/db.js";

export const insertData = async (data) => {

    const insertQuery = `
        INSERT INTO CMS (wordFirstLang, sentenceFirstLang, wordSecondLang, sentenceSecondLang)
        VALUES (?, ?, ?, ?)
    `;
    db.serialize(() => {
        data.forEach((item) => {
            const { wordFirstLang, sentenceFirstLang, wordSecondLang, sentenceSecondLang } = item;
            db.run(insertQuery, [wordFirstLang, sentenceFirstLang, wordSecondLang, sentenceSecondLang]);
        });
    });
    console.log("hit the insertData");
};
