import express from 'express'
import { signup } from '../auth/signup.js';
import { signin } from '../auth/signin.js';
import { signout } from '../auth/signout.js';

const route=express.Router();

route.post('/signup',signup)
route.post('/signin',signin)
route.post("/signout",signout)



export default route