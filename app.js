var express = require('express');
var  app = express();
/**
 * host static Files
 */
app.use(express.static(__dirname + '/public'))

/***
 * listen to port
 */
app.listen(2000|process.env,()=>console.log("Listening port 2000"));


/**
 * Search request
 */

 app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/public/index1.html");
    if(req.query.search !== undefined) {
        console.log("Search for",req.query.search)
    }
 });
