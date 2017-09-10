const express = require('express');
const pathToDocs = "/Users/thaisun/Projects/KomodoSign-api/aapi/documents/temp"; // change to your path
const router = express.Router();
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');
const cheerio = require('cheerio');
const pgPool = require('pg-pool');
const pool = new pgPool({database:"ks"});
pool.connect((err,client,done)=>{
  err ? console.log("ERRRRRRRRR",err,client) : console.log("Connected")
	})
const query = (query,values=[])=>{ // queries data base with promise function
  return new Promise((resolve,reject)=>{
    pool.query({
      text:query,
      values: values
    },(err,result)=>{
      err ? reject(err) : resolve(result);
    })
  })
	}
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
  const komodoScript = '<script id="old" src="/js/komodosign.js"></script>';
  let $Script = '<script src="https://code.jquery.com/jquery-3.2.1.min.js"';
  $Script += 'integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="';
  $Script += 'crossorigin="anonymous"></script>';
  // let pdf2htmlExCssA = `<link rel="stylesheet" href="/css/base.min.css"/>`;
  // let pdf2htmlEXCssB = `<link rel="stylesheet" href="/css/fancy.min.css"/>`;
  // let pdf2htmlExCssC = `<link rel="stylesheet" href="/css/EIN.css"/>`; // has to be custom
  // let pdf2htmlExJsA = `<script src="/js/compatibility.min.js"></script>`;
  // let pdf2htmlExJsB = `<script src="/js/pdf2htmlEX.min.js"></script>`;
  const sigpad = '<script src="https://cdnjs.cloudflare.com/ajax/libs/signature_pad/1.5.3/signature_pad.min.js"></script>';
  const flScript = '<script src="https://cdnjs.cloudflare.com/ajax/libs/featherlight/1.7.8/featherlight.min.js" charset="utf-8"></script>'; 
  const interactScript = `<script src="https://cdnjs.cloudflare.com/ajax/libs/interact.js/1.2.9/interact.min.js"></script>`;
  const customCSS = '<link rel="stylesheet" href=/css/style.css>';
  const bootstrap = '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous">';
  const featherlightCSS = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/featherlight/1.7.8/featherlight.min.css">';
  $('head').append(bootstrap);
  $('head').append(featherlightCSS);
  $('head').append(customCSS);
  // $('head').append(pdf2htmlExCssA);
  // $('head').append(pdf2htmlExCssB);
  // $('head').append(pdf2htmlExCssC);
  $('body').append($Script);
  $('body').append(interactScript);
  $('body').append(flScript);
  $('body').append(sigpad);
  $('body').append(komodoScript);
  $('body').append(conversionScript);
  // $('body').append(pdf2htmlExJsA);
  // $('body').append(pdf2htmlExJsB);

  $('#page-container').prepend(navbar);

  console.log('stepOne scripts appended');

  fs.writeFile(`${__dirname}/${folderName}.html`, $.html(), (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('script successfully injected into html');
    res.sendFile(`${__dirname}/${folderName}.html`);
  });
	}; // end of stepOne
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    	console.log("HELLO")
        cb(null, __dirname + '/uploads/')
    },
    filename: function (req, file, cb) {
    	console.log("HELLO")
    	let newName = file.originalname.replace([/[^a-zA-Z0-9]/g],"")
    	console.log(newName)
        cb(null, newName.replace(" ","")) // rename filename to original filename instead of alphanumeric
  }
	});
const upload = multer({
  storage: storage,
	})
const ksPDF2HTML = (pdfPath, res, pdfName) => {
  console.log(`Converting uploaded ${pdfName} to HTML file`);
  exec(`pdf2htmlEX --fit-width 612 --fit-height 792 --dest-dir ${pathToDocs}/${pdfName}  ${pdfPath}`, (err, stdout, stderr) => {
    if (err) {
      console.log('child_process execution error: ', err);
      return
    }
    if (stdout) {
      console.log(stdout);
    }
    query("insert into doc_prepare(temp_path) values($1) returning id",[`${pathToDocs}/${pdfName}/${pdfName}.html`]).then(next=>{
    	/****
		after the conversion process is done insert the file path into the db
		if something goes wrong in the db throw an error 
		else get the id and redirect to prepare route
    	****/
    	let {id} = next.rows[0];
    	if(!id){
    		// log some message
    		// clean up folders
    		res.status(500).send({Error:"Something Went Wrong Please Try Again Later",Status:"500"});
    	}else{
    		res.send(`/doc/prepare/${id}`);
    	}
    }).catch(e=>{
    		console.log(e)
    		res.status(501).send({Error:"Something Went Wrong Please Try Again Later",Status:"501"});
    })
    // stepOne(`${pathToDocs}/${pdfName}/${pdfName}.html`, pdfName, res);
    return;
  })
	}
const save = (data,userid,accountid)=>{

	fs.mkdir(`../${accountid}/${userid}`,(error)=>{
		if (error){
			// if the directory wasnt there
			if(error.code == "EEXIST"){
				fs.writeFile("./uploads/${accountid}/${userid}/${filename}.html",data,(err)=>{
					if(err){
						throw err;
						console.log(err);
					}else{
						// log file {filename} has been saved
						console.log("File Has Been Saved, Saving Path To DB");
						query(`insert into [table] values($1,$2,$3) returning id` ,[`./uploads/${accountid}/${userid}/${filename}.html`,`${accountid}`,`${userid}`]).then(data=>{
							const {id} = data.rows[0];
							if(id){
								// if an id is returned then everything went okay
								// logger
								console.log("Saved File Path into DB");
								// also return file path
							}else{
								throw err;
								console.log("Problem Saving FilePath to DB");
							}
						}).catch(error=>{
							console.log("Recieved an error ",error)
							res,sendStatus(500)
						})
					}
				})
			}
			else{
				// if error code wasnt EEXIST
				throw error
			}
		}
		else {
			// if the wasnt an error while try to make dir , then try to save file
			fs.writeFile("./uploads/${accountid}/${userid}/${filename}.html",data,(err)=>{
				if(err){
						// if error try throw error
						throw err;
					}else{
						console.log("File Has Been Saved, Saving Path To DB");
						// save filepath into db
						query(`insert into [table] values($1,$2,$3) returning id` ,[`./uploads/${accountid}/${userid}/${filename}.html`,`${accountid}`,`${userid}`]).then(data=>{
							if(id){
								// logger
								// if an id is returned then everything went okay
								console.log("Saved File Path into DB");
								// also return file path
							}else{
								throw err;
								console.log("Problem Saving FilePath to DB");
							}
						}).catch(error=>{
							console.log("Got an Error in Save ",error)
						})

					}
			})
			
		}
	})
	}


router.post('/upload', upload.single('file'),(req, res, next)=>{
	//------ Saves The Document
	//------- Default Params for who can see it
	let {"X-UserID":userid,"X-Token":token} = req.headers
	// const {doc} = req.body
	const doc = req.file;
	// remove file if 403/500
	console.log(doc)
	userid = "qwewsdfvgskzdfgvkb"; //temp keys
	token = "qwewsdfvgskzdfgvkb"; //temp keys
	if (!userid|| !token){
		res.status(403).send({Error:"Not Authenicated",Status:"403"})	
	}else if (!doc){
		res.status(401).send({Error:"Document Not Recieved",Status:"401"})
	}else{
		// query(`select exists (select 1 from ks_user 
		// 	join token on ks_user.id = token.owner where ks_user.code = $1 and token.token = $2)`,[userid,token]).then(results=>{
		// 	// checking if user with asscoiated token exists or token is active???
		// 	const {exists} = results.rows[0]
		// 	if (exists){
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
				let pdfName = req.file.filename.slice(0,-4);
				console.log(pdfName)
				ksPDF2HTML(doc.path,res,pdfName);
		// 	}else{
		// 		// log message -- something to do with authenication
		// 		console.log("No Auth")
		// 		res.status(403).send({Error:"Not Authenicated",Status:"403"})	
		// 	}
		// }).catch(error=>{
		// 	// log error perhaps with stack trace
		// 	console.log(error)
		// 	res.status(500).send({Error:"Error Recieving Document, Please Try Again Later",Status:"500"})
		// })
	}
	});

router.get("/prepare/:docid",(req,res,next)=>{
	console.log(req.params)
	let {docid} = req.params;
	query("select temp_path from doc_prepare where id = $1",[docid]).then((doc_path)=>{
		let {temp_path} = doc_path.rows[0]
		if(!temp_path){
			console.log("Document doesnt exist",docid);
			res.status(404).send({Error:"Could Not Find Document With That ID",Status:"404"});
		}else{
			return stepOne(temp_path, docid, res);
			// res.status(200).send({Error:"Could Not Find Document With That ID",Status:"404"});

		}

	}).catch(error=>{
		console.log("Got an Error",error);
		res.status(500).send({Error:"We Are Having Some Trouble Finding That Document, Please Try Again A Little Later",Status:"500"});
	})

	})

router.post("/save",(req,res,next)=>{

	})

router.get('/:docid',(req,res,next)=>{
	// no decimal points
	let {"X-UserID":userid,"X-Token":token} = req.headers
	userid = "qwewsdfvgskzdfgvkb";
	token = "qwewsdfvgskzdfgvkb";
	const {docid} = req.params;

	if (!userid || !token){
		res.status(403).send({Error:"Not Authenicated",Status:"403"});	
	}
	else if (!docid){
		res.status(404).send({Error:"Missing Param Document ID",Status:"404"});	
	}
	else {
		if(typeof(+docid)=== "number"){
			// vulnerabilty using + could use boolean to check if ID
			console.log(docid,token,userid);

			query(`with check_stop as (
			select exists (select 1 from ks_user 
			join token on ks_user.id = token.owner where ks_user.code = $1 and token.token = $2)
      ),is_valid as(
			select exists,
			(case 
				when exists = false
					then false
				when exists = true
                      then (select exists (select 1 from document where id = $3 and document = $3))
				end) as checked
			from check_stop
			),get_doc as (
				select exists, 
			case 
				when exists = false
					then 'false'
				when exists = true
					then (select document_path from version where id = $3)
				end as document_path
			from is_valid
			)select * from get_doc`,[userid,token,+docid]).then(doc_path =>{
				console.log(doc_path);
				const document_path = doc_path.rows[0];

				if(document_path === 'false' || !document_path){
					res.status(404).send({Error:"Error Getting Document",Status:"404"});
						// log an error
					}
					else{
						res.sendFile(document_path,{lastModified: false},(err)=>{
							if (err){
								throw err;
								console.log(err);
							}else{
								console.log(`file ${file} requested by user :${userid}`);
								// log filesent was requested by userid userid
							}
						})
					}
			}).catch(error=>{
				console.log("Recived an error in docid",error);
				res.status(500).send({Error:"We Encountered An Error While Getting This File Please Try Again Later",Status:"500"});
			})

		}else{
			res.status(401).send({Error:"We Encountered An Error While Getting This File Please Try Again Later",Status:"401"});
		}
				}
	

	});

module.exports = router