import express from 'express'
const app = express()
//database connection
import db from './db.js';


import dotenv from 'dotenv';
dotenv.config();

//convert clint data to json object and then store in req.body
import bodyParser from 'body-parser';
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

//import { jwtAuthMiddleware} from './jwt.js';


//import the router files
import userRoutes from './routes/userRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';

//use the router files
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
