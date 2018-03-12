var express = require("express");
var request = require("request");
const { findCode } = require("ipu-core-code");
var app = express();
var isResultFound = false;
var isValidSearch = true;
var studentdata;

var d = new Date();
var n = d.getFullYear() + "";
var yearcode = parseInt(n.substring(2, 4));
var month = d.getMonth()
/**
 * set view engine
 */
app.set("view engine", "ejs");

/**
 * host static Files
 */
app.use(express.static(__dirname + "/public"));

/**
 * listen to port
 */
app.listen(process.env.PORT || 2000, () => console.log("Listening port 2000"));

var roll;

function findSubjectCode(id, subjectkeys) {
  if (subjectkeys) {
    let ids = Object.keys(subjectkeys);
    let name = "";
    ids.forEach(uid => {
      if (uid.includes(id)) name = initials(subjectkeys[uid]);
    });
    return name;
  } else return "";
}


/**
 * Search request
 */
app.get("/", (req, res) => {
  /***
   * Search Request will send result page
   * if found
   * else will send not found page
   *
   */
  if (req.query.search !== undefined) {
    searchResult(res, req.query.search.toString());
  } else
    /**
     * sends home page if it is not a search request
     */
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
    isResultFound = true;
    findApi(res, rollnumber);
  } else {
    isResultFound = false;
    isValidSearch = false;
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
  /**
   *
   * callcode 1 is for aniket965/res repo
   * callcode 0  for ipuresults/btech
   */
  var callcode = 0;
  let code = findCode(rollnumber, yearcode, month, 0);
  rollnumber.indexOf("039") === 6 ? (callcode = 1) : (callcode = 0);
  getDataFromApi(res, rollnumber, code, callcode, yearcode);
}

/**
 * calls apis
 */

function getDataFromApi(res, rn, code, callcode, yearcode) {
  if (callcode === 0) {
    if (code.substr(1, 3) === "074") {
      code = "6036" + yearcode;
    }
    request(`https://raw.githubusercontent.com/ipuresults/btech/master/api/${code}.json`,
      function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var info = JSON.parse(body);
          if (info[rn] !== undefined) {
            roll = rn;
          let r = info[rn]
          r['codes'] = info['subject_codes']
            res.render("result", r);
          } else {
            res.render("404");
          }
        } else if (response.statusCode !== 200) {
          res.render("404");
          updateApi();
        } else {
          res.render("404");
        }
      }
    );
  } else if (callcode === 1) {
    request(
      "https://raw.githubusercontent.com/aniket965/res/master/api/" +
        code +
        ".json",
      function(error, response, body) {
        if (!error && response.statusCode == 200) {
          var info = JSON.parse(body);
          if (info[rn] !== undefined) {
            roll = rn;
            let r = info[rn]
            let subcodes = info['subject_codes']
            res.render("result", r);
          } else res.render("404");
        } else if (response.statusCode !== 200) {
          res.render("404");
          updateApi();
        } else {
          res.render("404");
        }
      }
    );
  }
}
