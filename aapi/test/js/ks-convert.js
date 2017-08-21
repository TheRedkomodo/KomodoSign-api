var convert = function () {
  var $canvas = "<canvas id='canvas' class='signature-pad' width=400 height=200></canvas><div><button id='save'>Save</button><button id='clear'>Clear</button></div>";

  var clickToSignTxt = $('<a href="#" class="haha">click to sign</a>');
  clickToSignTxt.attr('data-featherlight',$canvas);
  $('.signatures').html(clickToSignTxt)
  console.log('gangsta-boogie')
  // $('.haha').attr('data-featherlight', $canvas)

  var $this;
  $('body').on('click', '.placeholder a', function(){
    console.log('this: ', $(this))
    // capture value of currently clicked element;
    $this = $(this);
  })
  $('.placeholder a').featherlight('<canvas id="canvas" class="signature-pad" width=400 height=200></canvas><div><button id="save">Save</button><button id="clear">Clear</button></div>',{
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
      $img+= ' src="' + data;
      $img+='">'
      $($this).html('');
      $($this).append($img);
      console.log($img)
      // Send data to server instead...
      // window.open(data);
    });
    cancelButton.addEventListener('click', function (event) {
      signaturePad.clear();
    });
  }
  })
}
