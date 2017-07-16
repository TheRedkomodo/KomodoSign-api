var express = require('express');
var router = express.Router();
/***

psql -h "komodosigndev.czel2eb3sbyo.us-east-1.rds.amazonaws.com" -U "komodosigndev" -d "komodosigndwev"
psql -h "komodosigndev.czel2eb3sbyo.us-east-1.rds.amazonaws.com" -U "komodosigndev" 

****/

/* GET users listing. */

router.get('/all/:userid', function(req, res, next) {
  
  
  
  
  });

router.post('/:docid/:userid', function(req, res, next) {
  
  
  
  
  });

router.post('/upload/:userid', function(req, res, next) {
  
  
  
  
  });

router.post('/delete/:docid/', function(req, res, next) {
  
  
  
  
  });

router.post('/send/:userid/', function(req, res, next) {
  
  
  
  
  });

router.get('/status/:docid/', function(req, res, next) {
  
  
  
  
  });


module.exports = router;
