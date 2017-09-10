const express = require('express');
const router = express.Router();

router.get('/', (req, res, next)=>{
		// res.sendFile(`${__dirname}/EIN.html`)

		res.sendFile(`${__dirname}/views/upload.html`)
})

module.exports = router;

