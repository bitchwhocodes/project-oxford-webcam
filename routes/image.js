var express = require('express');
var router = express.Router();
var Spark = require("spark");
var oxfordEmotion = require("node-oxford-emotion")(process.env.PO_KEY);
var fs = require('fs');
var sys = require('sys');



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
var path = require('path'); 
var url = path.join(process.cwd(), 'public') 
var hostname  = req.protocol + '://' + req.get('host');
//test image
//var image = "https://ga-core.s3.amazonaws.com/production/uploads/instructor/image/2182/full.staceymulcahy220.jpg"
fs.writeFile(url+'/images/image.jpeg', req.body.data, 'base64', function(err) {
    oxfordEmotion.recognize("url", hostname+"/images/image.jpeg", function(response) {
        console.log(response);
        //doSpark(response);
        res.json(response);
    });
 
 });

});

/*
function doSpark(response)
{
    var isHappy = 
    Spark.login({ username: process.env.USER_NAME, password: process.env.PASS_WORD }, function(err, body) {
      //to handle
      Spark.callFunction(process.env.SPARK_ID,'setHappy','3',function(err,data){
             console.log("favorite called?");
        }); 
  });
    
}
*/

module.exports = router;