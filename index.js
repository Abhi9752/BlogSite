const express = require("express");
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');

dotenv.config({path:"./config.env"})
require('./DB/connection')

app.use(express.json())
app.use(cors({
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization',"Access-Control-Allow-Origin"]
}));
app.use(require('./api/index'));
const PORT = process.env.PORT;
 

 
 app.listen(PORT,()=>console.log(`Server Running at port ${PORT}`))