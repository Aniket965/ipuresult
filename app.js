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

        searchResult(res, req.query.search.toString());
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

function searchResult(res, rollnumber) {
    /**
     * Checks if query is valid rollnumber or not
     */
    if (/^\d{11}$/.test(rollnumber)) {
        isResultFound = true

        findApi(res, rollnumber);

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

function findApi(res, rollnumber) {
    var code = "";
    /**
     * for usict
     */
    var d = new Date();
    var n = d.getFullYear() + "";
    var yearcode = parseInt(n.substring(2, 4));
    if (rollnumber.indexOf("164") === 3) {

        code = rollnumber.substring(3, 9) + yearcode;

    } else {

        /**
         * checks which sem is on way
         */
        if (d.getMonth() > 5) {
            var semcode = (yearcode - parseInt(rollnumber.substring(9, 11))) * 2;
        } else {
            var semcode = ((yearcode - parseInt(rollnumber.substring(9, 11))) * 2) - 1;
        }
        code = semcode +rollnumber.substring(3, 9) + yearcode ;
    }
    getDataFromApi(res, rollnumber, code);
}


/**
 * calls apis 02216403213
 */

function getDataFromApi(res, rn, code) {
    var request = require('request');
    request('https://raw.githubusercontent.com/ipuresults/btech/master/api/' + code + '.json', function (error, response, body) {
    //    console.log(body)
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body)
            if (info[rn] !== undefined) {
                roll = rn
                info[rn].total = Math.floor(info[rn].total)
                info[rn].credit = Math.floor(info[rn].credit)
                res.render('result', info[rn])
            } else
                res.render('404')
        }
        else  {
            res.render('404')
        }
    })
}