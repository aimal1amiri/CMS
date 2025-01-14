import db from "../config/db.js";

export const filter = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    wordFirstLang,
    wordSecondLang,
    sentenceFirstLang,
    sentenceSecondLang,
    id,
  } = req.query;

  const currentPage = Math.max(1, parseInt(page));
  const itemsPerPage = Math.max(1, parseInt(limit));
  const offset = (currentPage - 1) * itemsPerPage;

  let query = `SELECT * FROM CMS WHERE 1=1 `;
  let countQuery = `SELECT COUNT(*) as total FROM CMS WHERE 1=1 `;
  const params = [];

   
  if (wordFirstLang) {
    query += `AND wordFirstLang = ? `;
    countQuery += `AND wordFirstLang = ? `;
    params.push(wordFirstLang);
  }
  if (wordSecondLang) {
    query += `AND wordSecondLang = ? `;
    countQuery += `AND wordSecondLang = ? `;
    params.push(wordSecondLang);
  }
  if (sentenceFirstLang) {
    query += `AND sentenceFirstLang LIKE ? `;
    countQuery += `AND sentenceFirstLang LIKE ? `;
    params.push(`%${sentenceFirstLang}%`);
  }
  if (sentenceSecondLang) {
    query += `AND sentenceSecondLang LIKE ? `;
    countQuery += `AND sentenceSecondLang LIKE ? `;
    params.push(`%${sentenceSecondLang}%`);
  }
  if (id) {
    query += `AND id = ? `;
    countQuery += `AND id = ? `;
    params.push(Number(id));
  }

  
  query += `LIMIT ? OFFSET ?`;
  const paginationParams = [...params, itemsPerPage, offset];



  try {
    
    db.get(countQuery, params, (countErr, countRow) => {
      if (countErr) {
        console.error("Error counting rows: ", countErr.message);
        return res.status(500).json({ success: false, message: "Server error" });
      }

      const totalItems = countRow?.total || 0;
      const totalPages = Math.ceil(totalItems / itemsPerPage);

    
      db.all(query, paginationParams, (err, rows) => {
        if (err) {
          console.error("Error filtering data: ", err.message);
          return res.status(400).json({ success: false, message: "Server error" });
        }

        res.status(200).json({
          success: true,
          data: rows,
          pagination: {
            current: currentPage,
            itemsPerPage,
            totalItems,
            totalPages,
          },
        });
      });
    });
  } catch (error) {
    console.error("Unexpected error: ", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
