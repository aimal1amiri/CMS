import express from 'express';

import databaseRoutes from './routes/databaseRoutes.js'
import authenticaitonRoutes from './routes/authenticationRoutes.js'
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path'
import dotenv from 'dotenv';

dotenv.config();
const CMS = express();
const __dirname = path.resolve();


CMS.use(express.json());
CMS.use(bodyParser.json());

const allowedOrigins = [
    'http://localhost:5173', 
    "https://cms-72aj.onrender.com", 
 
]
/*
CMS.use(cors({
    origin: allowedOrigins, 
        
    
}));
*/

CMS.use(cors({
    origin: allowedOrigins, // Allow the origins listed
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow credentials (cookies, headers, etc.)
  }));
  

CMS.use("/api/v1/data",databaseRoutes)
CMS.use("/api/v1/auth",authenticaitonRoutes)


if(process.env.NODE_ENV === "production"){
    CMS.use(express.static(path.join(__dirname, "/Front-end/dist")));

    CMS.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"Front-end","dist","index.html"))
    })

}





const port = 3000

CMS.listen(port , ()=>{
    console.log(`server port:${port}`)
});