var express = require('express');
var  app = express();
var isResultFound = true;
var isValidSearch = true; 
/**
 * set view engine
 */
app.set('view engine', 'ejs');

/**
 * host static Files
 */
app.use(express.static(__dirname + '/public'))

/**
 * listen to port
 */
app.listen(2000|process.env,()=>console.log("Listening port 2000"));


/**
 * Search request
 */
 app.get('/',(req,res)=>{
    
    /***
     * Search Request will send result page
     * if found 
     * else will send not found page
     * 
     */
    if (req.query.search !== undefined) {
        
        searchResult(req.query.search);
        
        if(isResultFound)    
            res.render('result');
        
        else if(isValidSearch)
                updateApi();
        else
            res.render('404')


    }


    /**
     * sends home page if it is not a search request
     */    
    else
        res.sendFile(__dirname+"/public/index1.html");
 });





/**
 * Checks rollnumber
 * Search for result in api
 */
 function searchResult(rollnumber){
     /**
      * Checks if query is valid rollnumber or not
      */
    if(/^\d{11}$/.test(rollnumber)){
        isResultFound = true
    }
     else {
        isResultFound = false
        isValidSearch = false
    }
    
 }

/**
 * Updates the api
 */
 function updateApi() {

 }