import db from '../config/db.js'

export const updateData = (req,res)=>{
    const { id }=req.params;
    const { wordFirstLang, wordSecondLang, sentenceFirstLang, sentenceSecondLang } = req.body;

    if(!id){
        return res.status(400).json({success:false, message:"ID is required"});

    }

    const query = `
    UPDATE CMS
        SET 
            wordFirstLang = COALESCE(?, wordFirstLang),
            wordSecondLang = COALESCE(?, wordSecondLang),
            sentenceFirstLang = COALESCE(?, sentenceFirstLang),
            sentenceSecondLang = COALESCE(?, sentenceSecondLang)
        WHERE id = ?
    `;

    db.run(
        query, 
        [wordFirstLang, wordSecondLang, sentenceFirstLang, sentenceSecondLang, id],
        function (err){
            if(err){
                console.log("error in updating function: ",err.message)
                return res.status(500).json({success:false, message:"Failed to update"})
            }

            if(this.changes == 0){
                return res.status(404).json({success:false, message:"The specific data not found"})
            }

            res.status(200).json({success:true, message:`Record with Id: ${id} updated successfully`})

        }
    )
}