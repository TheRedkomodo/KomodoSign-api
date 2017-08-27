const express = require('express');
const router = express.Router();
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

router.post('/', (req, res, next)=> {
	//----- Saving Signature
	const {"X-UserID":userid,"X-Token":token} = req.headers
	const {esig} = req.body
	if (!userid|| !token){
		res.status(403).send({Error:"Not Authenicated",Status:"403"})	
	}else if (!esig){
		res.status(401).send({Error:"Signature Not Recieved",Status:"401"})
	}else{
		query(`select exists (select 1 from [fromtable] where userid = $1 and token = $2)`,[userid,token]).then(results=>{
			// checking if user with asscoiated token exists or token is active???
			const {exists} = results.rows[0]
			if (exists){
				// save the signature [main account][userid][signature svg path]
				// save the signature [main account][userid][signature image path]
				// take the signature and perpare it to be saved turn svg into image.
				// query the db for the accountid or already have it 
				// check to see if save path exist 
				// 			if it doesnt exist created it
				// otherwise save the new file in the path
				// return the saved file path 
				// take the saved file path and add it in the db also add who can view
				// update the tables of who can have access to the signature
				// check to see if file is there and it is confirm
				// and the perhaps return signature id
				save(esig,userid,accountid)
			}else{
				res.status(403).send({Error:"Not Authenicated",Status:"403"})
			}
		}).catch(error=>{
			// log error perhaps with stack trace
			console.log(error)
			res.status(500).send({Error:"Error Recieving Signature, Please Try Again Later",Status:"500"})
		})
	}
 });

router.get('/:sigid', (req, res, next)=> {
	const {"X-UserID":userid,"X-Token":token} = req.headers
	const {sigid} = req.params
	if (!userid|| !token){
		res.status(403).send({Error:"Not Authenicated",Status:"403"})	
	}else if (!sigid){
		res.status(401).send({Error:"Signature Not Recieved",Status:"401"})
	}else{
		query(`with check_stop as(
			select exists (select 1 from [fromtable] where userid = $1 and token = $2)
			), is_valid as(
			select exists,
			case 
				when exists = false
					then Raise Exception 'UserID or Token is incorrect'
				when exists =true
					then select exists (select 1 from [fromtable] where userid = $1 and sigid = $3)
				end
			from check_stop
			)select exists, 
			case 
				when exists = false
					then Raise Exception 'Cannot Access Signature, UserID : $1'
				when exists = true
					then select signature_path from [fromtable] where sigid = $3
				end
			from is_valid`,[userid,token,sigid]).then(sig_path=>{
				console.log(sig_path)
				const {sig_path: signature_path} = sig_path.rows[0]
				if (!signature_path){
					res.status(404).send({Error:"Error Getting Signature",Status:"404"})	
						// log an error
						}else{
							res.sendFile(document_path,{lastModified: false},(err)=>{
								if (err){
									// throw Error(err)
									throw err;
									console.log(err)
								}else{
									// log filesent was requested by userid userid
								}
						});
					}
				}).catch(error=>{
					// log error 
					res.status(500).send({Error:"We Encountered An Error While Getting This File Please Try Again Later",Status:"500"})	
				})
	}
 });


module.exports = router;
