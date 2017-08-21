let pdfName = undefined;
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { exec } = require('child_process');
const app = express();
const port = 3000;
const stepOne = require('./js/stepOneInject.js')
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

const ksPDF2HTML = (pdfPath, res) => {
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

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
  next();
});

app.use(bodyParser.json({limit:'50mb'}));

app.post('/upload/:userid', upload.single('file'), (req, res, next) => {
  const file = req.file;
  pdfName = req.file.originalname.slice(0,-4);
  // console.log('userid: ', req.params.userid);
  // console.log('body!: ', req.file);
  ksPDF2HTML(file.originalname,res); // separate process with different routes. one for upload, one for conversion... uploading screen, then converting screen.
  // res.sendStatus(200);
})
app.post('/convert', (req, res, next) => {
  console.log('body: ', req.body.html);
  // get html
  //stepTwo(html, res)
  // convert html for signing
  // remove komodosign script
  // add komodosign 2 script

  // fs.writeFile('intro-to-javascript-electronics/converted.html',req.body.html, (err) => {
  //   console.log('error: ', err);
  // })
  res.send('hello!')
})

app.listen(port, () => {
  console.log('listening on port ', port);
});
