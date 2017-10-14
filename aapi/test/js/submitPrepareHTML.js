const cheerio = require('cheerio');
const fs = require('fs');
const submitPrepareHTML = () => {
  //append function below to  to step one
  return `
    $('body').on('click', '#done', function(){
      //html post request that creator sends after preparation
      var completedHTML = $('html')[0].outerHTML;
      var data = {
        html: completedHTML
      }
      console.log(data)
      $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/convert',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (res) {
          console.log('success: ', res);
        },
        error: function(err) {
          console.log('error: ', err)
        }
      })
    })
  `
}; // end of submitPrepareHTML

module.exports = submitPrepareHTML;
