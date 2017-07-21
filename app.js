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
    request('https://raw.githubusercontent.com/ipuresults/btech/master/api/16403217.json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var info = JSON.parse(body)
            if(info[rn] !== undefined) {
                roll = rn 
                extractDatafromstudentAPI(res,JSON.stringify(info[rn]));
                }       
            else
                res.render('404')   
        }
        if(error) {
            res.render('404')
        }
    })
}



/**
 * Extract data from json to make it more clean
 */


 function extractDatafromstudentAPI(res,studentInfo) {
    //  console.log(studentInfo)
    var sd = studentInfo + "";
    var name = studentInfo.substring(12,studentInfo.indexOf("SID:"));
    // console.log(name)
    
         let reme = /\d{5}\(\d\)/g;      
        var match, indexes = [];
        var prev = null;
        var result = []
        var ids = {};
    while (match = reme.exec(studentInfo)) {
            if(prev !== null && ((match.index - prev) < 30)) {
               var smalldata = sd.substr(match.index,40); 
                var id = smalldata.substring(0,5);
                
                if(ids[id] === undefined) {
                    var d = {}
                    ids[id] = id;
                    var credit = smalldata.substring(6,7);
                    var scorestring = smalldata.substring(8,smalldata.indexOf("\\r\\n"))
                    // console.log(scorestring)
                    var rescore = /\d{1,2}/g;
                    var scoreMatch = scorestring.match(rescore);
                   
                    let internal = "NA";
                    let external = "NA";
                    let total = "NA"
                    if(scoreMatch.length=== 2) {
                        
                        if(scoreMatch.indexOf(scoreMatch[0]) < 3){
                            internal = parseInt(scoreMatch[0])
                            external = parseInt(scoreMatch[1])
                            total = internal + external 
                        }
                    }

                   else if(scoreMatch.length === 1) {
                    // console.log(scoreMatch.indexOf(scoreMatch[0]))    
                    if(scorestring.indexOf(scoreMatch[0])< 3) {
                            
                            internal = scoreMatch[0]
                            total = parseInt(internal)
                        }
                        else {
                            external = scoreMatch[0]
                            total  = parseInt(external)
                        }
                    }
    
                    // if(scorestring.includes("89"))
                    // console.log(internal,external)

                    result.push({
                        id:id,
                        credit:credit,
                        internal_mark :internal,
                        external_mark:external,
                        total : total
                    });
                }
                else
                    break;
                
            }
            prev = match.index
    }
    
    studentdata = {
        name:name,
        rollnumber : roll,
        result:result,
        total : "89",
        credit:"79",
        college_rank:25,
        university_rank:89
    }
    console.log(result)
  
    res.render('result', studentdata);
 }