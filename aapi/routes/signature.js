var express = require('express');
var router = express.Router();

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
