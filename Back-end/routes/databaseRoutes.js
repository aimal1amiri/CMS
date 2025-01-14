import express from 'express'
import {populateDatabase} from '../controller/populateDatabase.js'
import { readData } from '../CRUD/readData.js';
import { filter } from '../controller/filter.js';
import { updateData } from '../CRUD/updateData.js';
import { search } from '../controller/search.js'
import { authWall } from '../middleware/authWall.js';



const route=express.Router();


route.post('/populate',authWall,populateDatabase)
 
route.get('/filter',filter)
route.put('/update/:id' ,authWall,updateData)
route.get('/search',search)




export default route;