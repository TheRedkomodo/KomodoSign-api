const express = require('express');
const router = express.Router();
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const cheerio = require('cheerio');
const fs = require('fs');
// const stepTwo = require('./stepTwoInject.js')
const stepTwo = () => {
  return `$('body').on('click', '#done', function(){
    var completedHTML = $('html')[0].outerHTML;
    var data = {
      html: completedHTML
    }
    console.log(data)
    // $('#old').remove()
    convert = true;
    // convert();
    // $.ajax({
    //   type: 'POST',
    //   url: 'http://localhost:3000/convert',
    //   data: JSON.stringify(data),
    //   contentType: 'application/json',
    //   success: function (res) {
    //     console.log('success: ', res);
    //   },
    //   error: function(err) {
    //     console.log('error: ', err)
    //   }
    // })
    var $canvas = "<canvas id='canvas' class='signature-pad' width=400 height=200></canvas><div><button id='save'>Save</button><button id='clear'>Clear</button></div>";
    var clickToSignTxt = $('<a href="#" class="haha">click to sign</a>');
    clickToSignTxt.attr('data-featherlight',$canvas);
    $('.signatures').html(clickToSignTxt)
    console.log('gangsta-boogie')
    // $('.haha').attr('data-featherlight', $canvas)
    var $this;
    $('body').on('click', '.signatures a', function(){
      console.log('this: ', $(this))
      // capture value of currently clicked element;
      $this = $(this);
    })
    $('.signatures a').featherlight({
      otherClose: '#save',
      afterContent: function(){
        console.log('before')
        var signaturePad = new SignaturePad(document.getElementById('canvas'), {
          backgroundColor: 'rgba(255, 255, 255, 0)',
          penColor: 'rgb(0, 0, 0)'
        });
        var saveButton = document.getElementById('save');
        var cancelButton = document.getElementById('clear');
        saveButton.addEventListener('click', function (event) {
          var data = signaturePad.toDataURL('image/png');
          var $img = '<img class="signature"';
          var style = {
              'width': '128px',
              'height': '42px'
            };
          $img+= ' src="' + data;
          $img+='">'
          $($this).html('');
          $($this).append($img);
          $($this).parent().css(style);
          $($this).parent().parent().css('border', 'none');
          console.log($img)
          // Send data to server instead...
          // window.open(data);
        });
        cancelButton.addEventListener('click', function (event) {
          signaturePad.clear();
        });
      }
    })
  })`
	};

const stepOne = (htmlPath, folderName, res) => {
  console.log('initializing stepOne');
  const html = fs.readFileSync(`${htmlPath}`, 'utf8');
  const $ = cheerio.load(html);
  const navbar = `<div class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <div class="container">
        <div class="col-sm-12">
          <button id="done" type="button" name="button">Convert</button>
        </div>
      </div>
  </div>`;
  const conversionScript = `<script>${stepTwo()}</script>`;
  const komodoScript = '<script id="old" src="../js/komodosign.js"></script>';
  let $Script = '<script src="https://code.jquery.com/jquery-3.2.1.min.js"';
  $Script += 'integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="';
  $Script += 'crossorigin="anonymous"></script>';
  const sigpad = '<script src="https://cdnjs.cloudflare.com/ajax/libs/signature_pad/1.5.3/signature_pad.min.js"></script>'
  const flScript = '<script src="https://cdnjs.cloudflare.com/ajax/libs/featherlight/1.7.8/featherlight.min.js" charset="utf-8"></script>'; // absolute path
  const interactScript = `<script src="https://cdnjs.cloudflare.com/ajax/libs/interact.js/1.2.9/interact.min.js"></script>`
  const customCSS = '<link rel="stylesheet" href="/Users/jamescarter/Desktop/the work/komodosign/test/style.css">'; // use absolute paths make sure to change
  const bootstrap = '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous">';
  const featherlightCSS = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/featherlight/1.7.8/featherlight.min.css">'
  $('head').append(bootstrap);
  $('head').append(featherlightCSS);
  $('head').append(customCSS);
  $('body').append($Script);
  $('body').append(interactScript);
  $('body').append(flScript);
  $('body').append(sigpad);
  $('body').append(komodoScript);
  $('body').append(conversionScript);
  $('#page-container').prepend(navbar);

  console.log('stepOne scripts appended');

  fs.writeFile(`${__dirname}/${folderName}.html`, $.html(), (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('script successfully injected into html');
    // res.sendStatus(200);
    // const command
    res.send(`${__dirname}/${folderName}.html`)
  });
	}; // end of stepOne

const save = (data,userid,accountid)=>{

	fs.mkdir(`../${accountid}/${userid}`,(error)=>{
		// making directory
		if (error){
			if(error.code == "EEXIST"){
				// if the directory already exist then try to save the file
				fs.writeFile("./uploads/${accountid}/${userid}/${filename}.html",data,(err)=>{
					if(err){
						// if error try throw error
						throw err;
					}else{
						// log file {filename} has been saved
						console.log("File Has Been Saved, Saving Path To DB");
						// save filepath into db
						query(`insert into [table] values($1,$2,$3) returning id` ,[`./uploads/${accountid}/${userid}/${filename}.html`,`${accountid}`,`${userid}`]).then(data=>{
							const {id} = data.rows[0];
							if(id){
								// if an id is returned then everything went okay
								// logger
								console.log("Saved File Path into DB");
								// also return file path
							}else{
								// logger
								// throw err
								throw err;
								console.log("Problem Saving FilePath to DB");
							}
						})
					}
				})
			}else{
				// if another error while trying to make dir 
				throw err;
			}
		}else{
			// if the wasnt an error while try to make dir , then try to save file
			fs.writeFile("./uploads/${accountid}/${userid}/${filename}.html",data,(err)=>{
					if(err){
						// if error try throw error
						throw err;
					}else{
						// log file {filename} has been saved
						console.log("File Has Been Saved, Saving Path To DB");
						// save filepath into db
						query(`insert into [table] values($1,$2,$3) returning id` ,[`./uploads/${accountid}/${userid}/${filename}.html`,`${accountid}`,`${userid}`]).then(data=>{
							const {id} = data.rows[0];
							if(id){
								// logger
								// if an id is returned then everything went okay
								console.log("Saved File Path into DB");
								// also return file path
							}else{
								// logger
								// throw err
								throw err;
								console.log("Problem Saving FilePath to DB");
							}
						})
					}
				})
			}

		}
	})

	}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // rename filename to original filename instead of alphanumeric
  }
	});

const upload = multer({
  storage: storage,
	})

const ksPDF2HTML = (pdfPath, res, pdfName) => {
  console.log(`Converting uploaded ${pdfName} to HTML file`);
  exec(`pdf2htmlEX --fit-width 612 --fit-height 792 --embed-css 0 --embed-javascript 0 --embed-image 0  --dest-dir ${pdfName}  uploads/${pdfPath}`, (err, stdout, stderr) => {
    if (err) {
      console.log('child_process execution error: ', err);
      return
    }
    if (stdout) {
      console.log(stdout);
    }
    stepOne(`${__dirname}/${pdfName}/${pdfName}.html`, pdfName, res);
    return;
  })
	}

router.post('/upload', upload.single('file'),(req, res, next)=>{
	//------ Saves The Document
	//------- Default Params for who can see it
	const {"X-UserID":userid,"X-Token":token} = req.headers
	// const {doc} = req.body
	const doc = req.file;
	if (!userid|| !token){
		res.status(403).send({Error:"Not Authenicated",Status:"403"})	
	}else if (!doc){
		res.status(401).send({Error:"Document Not Recieved",Status:"401"})
	}else{
		query(`select exists (select 1 from [fromtable] where userid = $1 and token = $2)`,[userid,token]).then(results=>{
			// checking if user with asscoiated token exists or token is active???
			const {exists} = results.rows[0]
			if (exists){
				// save the document [main account][userid][document path]
				// take the doc and perpare it to be saved replace all the tags with the correct info.
				// query the db for the accountid or already have it 
				// check to see if save path exist 
				// 			if it doesnt exist created it
				// otherwise save the new file in the path
				// return the saved file path 
				// take the saved file path and add it in the db also add who can view
				// update the tables of who can have access to the document
				// check to see if file is there and it is confirm
				// and the perhaps return document id
				// save(doc,userid,accountid)
				let pdfName = req.file.originalname.slice(0,-4);
				ksPDF2HTML(file.originalname,res,pdfName);
			}else{
				// log message -- something to do with authenication
				res.status(403).send({Error:"Not Authenicated",Status:"403"})	
			}
		}).catch(error=>{
			// log error perhaps with stack trace
			res.status(500).send({Error:"Error Recieving Document, Please Try Again Later",Status:"500"})
		})
	}
	});

router.get('/:docid',(req,res,next)=>{
	//------ Gets The Document
	const {"X-UserID":userid,"X-Token":token} = req.headers
	const {docid} = req.params
	if (!userid || !token){
		res.status(403).send({Error:"Not Authenicated",Status:"403"})	
	}else if (!docid){
		res.status(404).send({Error:"Missing Param Document ID",Status:"404"})	
	}else {
		// begin to get the document
		// but first check to make sure userid and token are valid
		// if they are valid then get the userid and check access level
		// if they can access this document then return the path
		query(`with check_stop as (
			select exists (select 1 from [fromtable] where userid = $1 and token = $2)
			),is_valid as(
			select exists,
			case 
				when exists = false
					then Raise Exception 'UserID or Token is incorrect'
				when exists =true
					then select exists (select 1 from [fromtable] where userid = $1 and docid = $3)
				end
			from check_stop
			)select exists, 
			case 
				when exists = false
					then Raise Exception 'Cannot access document, UserID : $1'
				when exists = true
					then select document_path from [fromtable] where docid = $3
				end
			from is_valid`,[userid,token,docid]).then(doc_path =>{
				console.log(doc_path)
				const {doc_path: document_path} = doc_path.rows[0]
				if(!document_path){
					res.status(404).send({Error:"Error Getting Document",Status:"404"})	
						// log an error
					}else{
						res.sendFile(document_path,{lastModified: false},(err)=>{
							if (err){
								// Throw Error(err)
								throw err;
								console.log(err)
							}else{
								console.log(`file ${file} requested by user :${userid}`)
								// log filesent was requested by userid userid
							}
						});
					}
				}).catch(error=>{
					// log error 
					res.status(500).send({Error:"We Encountered An Error While Getting This File Please Try Again Later",Status:"500"})	
				})
			})
		}


	});

module.exports = router