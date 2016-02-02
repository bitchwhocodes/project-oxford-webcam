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
        res.json(response);
    });
 
});







  
});

/*
function decodeBase64Image(dataString) 
        {
          var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
          var response = {};

          if (matches.length !== 3) 
          {
            return new Error('Invalid input string');
          }

          response.type = matches[1];
          response.data = new Buffer(matches[2], 'base64');

          return response;
        }

function getItemEmotionRating(data)
{
  console.log("get emotion rating",data);
  var promise = new Promise(function(resolve, reject) {
 
    oxfordEmotion.recognize("url", data, function(cb) {
     
  
      resolve(data);
    });
  });
  return promise;
}

*/

module.exports = router;