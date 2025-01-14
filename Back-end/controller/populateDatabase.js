import { insertData } from "../CRUD/insertData.js"
import fetchJsonData from "../utils/fetchData.js"


export const populateDatabase =async (req,res)=>{
    const {jsonUrl}=req.body;
    console.log(jsonUrl)

    if(!jsonUrl){
        return res.status(400).json({success:false, message:"JSON url required"})
    }

    try {
        const data = await fetchJsonData(jsonUrl);
        console.log(data);

        await insertData(data)

        res.status(200).json({success:true, message:"Database is populated"})

    } catch (error) {
        console.log("the populated error:",error);
        

        res.status(500).json({success:false, message:"Server error"})
        
    }
}

