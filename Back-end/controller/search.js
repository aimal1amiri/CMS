import db from "../config/db.js";

export const search = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  const offset = (parseInt(page) - 1) * parseInt(limit);

  
  const countQuery = `
    SELECT COUNT(*) as total
    FROM CMS
    WHERE LOWER(wordFirstLang) LIKE LOWER(?)
       OR LOWER(wordSecondLang) LIKE LOWER(?)
       OR LOWER(sentenceFirstLang) LIKE LOWER(?)
       OR LOWER(sentenceSecondLang) LIKE LOWER(?)
  `;

  
  const dataQuery = `
    SELECT * FROM CMS
    WHERE LOWER(wordFirstLang) LIKE LOWER(?)
       OR LOWER(wordSecondLang) LIKE LOWER(?)
       OR LOWER(sentenceFirstLang) LIKE LOWER(?)
       OR LOWER(sentenceSecondLang) LIKE LOWER(?)
    LIMIT ? OFFSET ?
  `;

  const params = [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`];

  try {
     
    db.get(countQuery, params, (err, countRow) => {
      if (err) {
        console.error("Error counting records:", err.message);
        return res.status(500).json({ success: false, message: "Server error" });
      }

      const total = countRow.total;

      
      db.all(dataQuery, [...params, Number(limit), Number(offset)], (err, rows) => {
        if (err) {
          console.error("Error fetching results:", err.message);
          return res.status(500).json({ success: false, message: "Server error" });
        }

        if (rows.length === 0) {
          return res.status(200).json({
            success: true,
            message: "No matching records found",
            data: [],
            pagination: {
              currentPage: Number(page),
              itemsPerPage: Number(limit),
              totalItems: total,
              totalPages: Math.ceil(total / limit),
            },
          });
        }

        res.status(200).json({
          success: true,
          data: rows,
          pagination: {
            currentPage: Number(page),
            itemsPerPage: Number(limit),
            totalItems: total,
            totalPages: Math.ceil(total / limit),
          },
        });
      });
    });
  } catch (error) {
    console.error("Unexpected error:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
