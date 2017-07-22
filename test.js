var rollnumber = "00816412815"
/**
 * for usict
 */
if(rollnumber.indexOf("164") === 3) {
    var d = new Date();
    var n = d.getMonth() + "";
    code = rollnumber.substring(3,9) + n.substring(2,4);
    console.log(n);
}

