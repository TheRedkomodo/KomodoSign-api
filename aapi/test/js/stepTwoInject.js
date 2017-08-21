const cheerio = require('cheerio');
const fs = require('fs');

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
}; // end of stepTwo

module.exports = stepTwo;
