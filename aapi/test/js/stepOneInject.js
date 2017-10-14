const cheerio = require('cheerio');
const fs = require('fs');
//stepTwo is injecting scripts/files necessary for making placeholders signable

const submitPrepareHTML = require('./submitPrepareHTML.js')
// stepOne is grabs newly generated pdfHtml and injects scripts/files necessary for document signature preparation (generating placeholders)
const stepOne = (htmlPath, folderName, recipients, res) => {
  console.log('initializing stepOne');
  console.log('recipients: ', Array.isArray(recipients))
  // grab newly generated pdfhtml
  const html = fs.readFileSync(`${htmlPath}`, 'utf8');
  const $ = cheerio.load(html);
  // navbar === toolbar
  const navbar = `<div class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
      <div class="container">
        <div class="col-sm-12">
          <button id="done" type="button" name="button">Done</button>
          <button id="add" type="button">Add Signature</button>
        </div>
      </div>
  </div>`;


  const recipientsScript = `<script> var recipients = ${JSON.stringify(recipients)}</script>`
  // inject the following files/scripts/html to pdfhtml, so that user can prepare document
  const postPreparedDocumentScript = `<script>${submitPrepareHTML()}</script>`;
  const komodoScript = '<script id="old" src="../js/komodosign.js"></script>';
  let $Script = '<script src="https://code.jquery.com/jquery-3.2.1.min.js"';
  $Script += 'integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="';
  $Script += 'crossorigin="anonymous"></script>';
  const sigpad = '<script src="../../../../test/node_modules/signature_pad/dist/signature_pad.min.js"></script>'
  const flScript = '<script src="../js/featherlight/featherlight.min.js" charset="utf-8"></script>'; // absolute path
  const interactScript = `<script src="../../../../test/node_modules/interactjs/dist/interact.min.js"></script>`
  const customCSS = '<link rel="stylesheet" href="/Users/jamescarter/Desktop/the work/komodosign/test/style.css">'; // use absolute paths
  const bootstrap = '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css" integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous">';
  const bootstrapJs = `
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js" integrity="sha384-b/U6ypiBEHpOf/4+1nzFpr53nxSS+GLCkfwBdFNTxtclqqenISfwAzpKaMNFNmj4" crossorigin="anonymous"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js" integrity="sha384-h0AbiXch4ZDo7tp9hKZ4TsHbi047NrKGLO3SEJAg45jXxnGIfYzk4Si90RDIqNm1" crossorigin="anonymous"></script>
`
  const featherlightCSS = '<link rel="stylesheet" href="../js/featherlight/featherlight.min.css">'
  $('head').append(bootstrap);
  $('head').append(featherlightCSS);
  $('head').append(customCSS);
  $('body').append($Script);
  $('body').append(bootstrapJs);
  $('body').append(interactScript);
  $('body').append(flScript);
  $('body').append(sigpad);
  $('body').append(recipientsScript);
  $('body').append(komodoScript);
  $('body').append(postPreparedDocumentScript);
  $('#page-container').prepend(navbar);

  console.log('stepOne scripts appended. User Can now Prepare document for signing');

  fs.writeFile(`/Users/jamescarter/Desktop/the work/komodosign/KomodoSign-api/aapi/test/${folderName}/${folderName}.html`, $.html(), (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('script successfully injected into html');
    // res.sendStatus(200);
    // const command
    res.send(`/Users/jamescarter/Desktop/the work/komodosign/KomodoSign-api/aapi/test/${folderName}/${folderName}.html`)
  });
}; // end of stepOne

module.exports = stepOne;
