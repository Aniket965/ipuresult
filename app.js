var express = require('express');
var app = express();
var isResultFound = false;
var isValidSearch = true;
var studentdata;
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
app.listen(process.env.PORT || 2000, () => console.log("Listening port 2000"));

var roll;

/**
 * Search request
 */
app.get('/', (req, res) => {

    /***
     * Search Request will send result page
     * if found 
     * else will send not found page
     * 
     */
    if (req.query.search !== undefined) {

        searchResult(res,req.query.search.toString());


    }


    /**
     * sends home page if it is not a search request
     */
    else
        res.sendFile(__dirname + "/public/index1.html");
});





/**
 * Checks rollnumber
 * Search for result in api
 */

function searchResult(res,rollnumber) {
    /**
     * Checks if query is valid rollnumber or not
     */
    if (/^\d{11}$/.test(rollnumber)) {
        isResultFound = true

        findApi();

        getDataFromApi(res,rollnumber);

    } else {
        isResultFound = false
        isValidSearch = false
    }

}

/**
 * Updates the api
 */
function updateApi() {

}


/**
 * finds api code through specific algoruth
 */

function findApi(rollnumber) {

}


/**
 * calls apis 02216403213
 */

function getDataFromApi(res,rn) {
    var request = require('request');
    request('https://raw.githubusercontent.com/ipuresults/btech/master/api/16412817.json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body)
            if(info[rn] !== undefined) {
                roll = rn 
                info[rn].total = Math.floor(info[rn].total)
                info[rn].credit = Math.floor(info[rn].credit)

                res.render('result',info[rn])
                }       
            else
                res.render('404')   
        }
        if(error) {
            res.render('404')
        }
    })
}

