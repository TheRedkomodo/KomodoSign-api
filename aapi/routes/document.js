var express = require('express');
var router = express.Router();
/***

psql -h "komodosigndev.czel2eb3sbyo.us-east-1.rds.amazonaws.com" -U "komodosigndev" -d "komodosigndwev"
psql -h "komodosigndev.czel2eb3sbyo.us-east-1.rds.amazonaws.com" -U "komodosigndev" 

****/
let save = (data,userid,accountid)=>{

	fs.mkdir(`../${accountid}/${userid}`,(error)=>{
		// making directory
		if (error){
			if(error.code == "EEXIST"){
				// if the directory already exist then try to save the file
				fs.writeFile("../${accountid}/${userid}/${filename}.html",data,(err)=>{
					if(err){
						// if error try throw error
						throw err;
					}else{
						// log file {filename} has been saved
						console.log("File Has Been Saved, Saving Path To DB");
						// save filepath into db
						query(`insert into [table] values($1,$2,$3) returning id` ,[`../${accountid}/${userid}/${filename}.html`,`${accountid}`,`${userid}`]).then(data=>{
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
			fs.writeFile("../${accountid}/${userid}/${filename}.html",data,(err)=>{
					if(err){
						// if error try throw error
						throw err;
					}else{
						// log file {filename} has been saved
						console.log("File Has Been Saved, Saving Path To DB");
						// save filepath into db
						query(`insert into [table] values($1,$2,$3) returning id` ,[`../${accountid}/${userid}/${filename}.html`,`${accountid}`,`${userid}`]).then(data=>{
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

router.post('/save', (req, res, next)=>{
	//------ Saves The Document
	//------- Default Params for who can see it
	const {"X-UserID":userid,"X-Token":token} = req.headers
	const {doc} = req.body
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
				save(doc,userid,accountid)
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