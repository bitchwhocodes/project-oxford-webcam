var express = require('express');
var router = express.Router();
var Spark = require("spark");
var oxfordEmotion = require("node-oxford-emotion")(process.env.PO_KEY);
var fs = require('fs');

var path = require('path'); 


function parseDataURL(body) {
  var match = /data:([^;]+);base64,(.*)/.exec(body);
  if(!match)
    return null;

  return {
    contentType: match[1],
    data: new Buffer(match[2], 'base64')
  };
}

/* GET image data here */
router.put('/', function(req, res, next) {
req.body.data = req.body.data.replace(/^data:image\/jpeg+;base64,/, "");
req.body.data = req.body.data.replace(/ /g, '+');

var url = path.join(process.cwd(), 'public') 
var hostname  = req.protocol + '://' + req.get('host');
//test image
//var image = "https://ga-core.s3.amazonaws.com/production/uploads/instructor/image/2182/full.staceymulcahy220.jpg"
fs.writeFile('../public/images/image.jpeg', req.body.data, 'base64', function(err) {
    
    console.log("File System"+err)
    oxfordEmotion.recognize("url", hostname+"/images/image.jpeg", function(response) {
        console.log(response);
        doSpark(response);
        res.json(response);
    });
 
 });

});


function doSpark(response)
{
    var value = parseFloat(response[0].scores.happiness);
    var isHappy = (value> 0.5)? "1":"0";
    Spark.login({ username: process.env.USER_NAME, password: process.env.USER_PASS }, function(err, body) {
      Spark.callFunction(process.env.SPARK_ID,'setMode',isHappy,function(err,data){
             // console.log
        }); 
  });
    
}

module.exports = router;