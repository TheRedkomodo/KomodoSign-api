var express = require('express');
var router = express.Router();

query =(statment,value=[])=>{
  
}

router.get("/docs",(req,res)=>{
  /*** 
  get the userid header
  get the token header
  get all documents associated with the token header and userid
  then send the documents
  ***/
  
  
  /**
  expect a token  
  user id 
  send all docs
  have user view all documents
  **/
})
router.get("/docs/:docid",(req,res)=>{
  
  /*** 
  get the userid header
  get the token header
  get the doc  id
  get the document associated with the token header and userid
  then send the documents to be downloaded or view
  ***/
  
})


router.post("/send",(req,res)=>{
  
  /***
  get the userid header
  get the token header
  get the doc  id
  get the document associated with the token header and userid
  get the email address of the recipient 
  get the what to expect eg.. [image,video,signature]
  generate a temperary link
  then send the email with the template 
  ***/ 
  
})

router.post("/docs",(req,res)=>{
  
  /**
  expect a token  
  user id 
  document id 
  **/
  
})







module.exports = router;
