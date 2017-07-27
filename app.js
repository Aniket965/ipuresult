var express = require('express');

var request = require('request');
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
    request("https://btechipuresults.herokuapp.com/update");
    console.log("updating");
    request("https://whoami-ani965.herokuapp.com/update");
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
    /**
     * callcode 1 is for aniket965/res repo
     * callcode 0  for ipuresults/btech
     */
    var callcode = 0;   
    // if (rollnumber.indexOf("164") === 3) {

    //     code = rollnumber.substring(3, 9) + yearcode;

    // }
    /**
     * For MBA
     */
    if (rollnumber.indexOf("039") === 6 ||
        rollnumber.indexOf("021") === 6 ||
        rollnumber.indexOf("044") === 6 ||
        rollnumber.indexOf("065") === 6 ||
        rollnumber.indexOf("088") === 6 ||
        rollnumber.indexOf("089") === 6 ||
        rollnumber.indexOf("248") === 6 ||
        rollnumber.indexOf("740") === 6||
        rollnumber.indexOf("020") === 6) {
        code = rollnumber.substr(6, 3) + yearcode;
        console.log(code);
            if (rollnumber.indexOf("039") === 6)
                callcode = 0
            else
                callcode = 1;
    } else {

        /**
         * checks which sem is on way
         */
        if (d.getMonth() > 5) {
            var semcode = (yearcode - parseInt(rollnumber.substring(9, 11))) * 2;
        } else {
            var semcode = ((yearcode - parseInt(rollnumber.substring(9, 11))) * 2) - 1;
        }
        code = semcode + rollnumber.substring(6, 9) + yearcode;
        console.log(code)
    }
   
    getDataFromApi(res, rollnumber, code,callcode);
}


/**
 * calls apis  
 */

function getDataFromApi(res, rn, code,callcode) {
    if(callcode === 0 ) {

    request('https://raw.githubusercontent.com/ipuresults/btech/master/api/' + code + '.json', function (error, response, body) {

        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body)
            if (info[rn] !== undefined) {
                roll = rn
    
                res.render('result', info[rn])
            } else
                res.render('404')
        } else if (response.statusCode !== 200) {
            res.render('404');
            updateApi()
        } else {
            res.render('404')
        }
    });
}else if(callcode === 1){

    request('https://raw.githubusercontent.com/aniket965/res/master/api/' + code + '.json', function (error, response, body) {

        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body)
            if (info[rn] !== undefined) {
                roll = rn
                info[rn].total = info[rn].total
                info[rn].credit =info[rn].credit
            
                res.render('result', info[rn])
            } else
                res.render('404')
        } else if (response.statusCode !== 200) {
            res.render('404');
            updateApi()
        } else {
            res.render('404')
        }
    });
}

}