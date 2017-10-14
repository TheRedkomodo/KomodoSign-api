// Use this script when a signee requests html to sign
const cheerio = require('cheerio');
const fs = require('fs');

// add signatureId paramater to function below, so we know what user (signee) to display signing ui to.
const stepThree = (signatureId) => {
  return
  // append everything below to html that signee receives. Call everything below conversion script
  var $canvas = "<canvas id='canvas' class='signature-pad' width=400 height=200></canvas><div><button id='save'>Save</button><button id='clear'>Clear</button></div>";

  var clickToSignTxt = $('<a href="#" class="haha">click to sign</a>');
  clickToSignTxt.attr('data-featherlight',$canvas);

  //This updates placeholder ui to actual signing ui (do this on serverSide)
  $('.signatures').html(clickToSignTxt)

  //grab all elements with class "signatures"
    // see if they contain the class with match signatureId
      // remove the elements that do not contain signatureId
  console.log('gangsta-boogie')
  // $('.haha').attr('data-featherlight', $canvas)

  // everything below should be in its own script
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
}; // end of stepTwo

module.exports = stepThree;
