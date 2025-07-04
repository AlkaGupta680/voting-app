const mongoose = require('mongoose') ;
require('dotenv').config();
const mongoURL = process.env.MONGODB_URL;
// const mongoDB_URL = process.env.MONGODB_URL_LOCAL;
//set up mongoDB connection 
mongoose.connect(mongoURL ,{
      useNewUrlParser:true,
      useUnifiedTopology:true       
}
) ;
// mongdb object 
const db=mongoose.connection ;
//define event listeners 
db.on('connected',()=>{
    console.log("MongoDB connected to server") ;
}) 
db.on('error',(err)=>{
    console.log("MongoDB error:",err) ;
}) 
db.on('disconnected',()=>{
    console.log("MongoDB disconnected") ;
}) 

 
  
//export 
module.exports = db ;
