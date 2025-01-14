import express from 'express';

import databaseRoutes from './routes/databaseRoutes.js'
import authenticaitonRoutes from './routes/authenticationRoutes.js'
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path'
import dotenv from 'dotenv';


const CMS = express();
const __dirname = path.resolve();


CMS.use(express.json());
CMS.use(bodyParser.json());

if(process.env.NODE_ENV === "production"){
    CMS.use(express.static(path.join(__dirname, "/Front-end/dist")));

    CMS.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"Front-end","dist","index.html"))
    })

}


CMS.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend's URL
    
}));


CMS.use("/api/v1/data",databaseRoutes)
CMS.use("/api/v1/auth",authenticaitonRoutes)


const port = 3000

CMS.listen(port , ()=>{
    console.log(`server port:${port}`)
});