interact('.signatures')
.resizable({
  // edges: { bottom: true, right: true }
  // squareResize: true
  edges: { left: true, right: true, bottom: true, top: true },
  // preserveAspectRatio: true
})
.on('resizemove', function(event) {
  // fixes inadverdant click from propogating
  interact(event.target).on('click', function (_event) {
    _event.stopPropagation();
  }, true);
  // end of propgation fix

  var target = event.target;
  // add the change in coords to the previous width of the target element
  var
   newWidth  = parseFloat(target.style.width ) + event.dx,
   newHeight = parseFloat(target.style.height) + event.dy;

  // update the element's style
  target.style.width  = newWidth + 'px';
  target.style.height = newHeight + 'px';

  // target.textContent = newWidth + '×' + newHeight;
})
var convert = false;
var pageCount = $('.pc');
console.log('page count: ',pageCount.length);
var count = 1;
var signature_container = '<div class="signature_container"></div>';
$('.pc').prepend(signature_container);

var addPlaceholder = function(e) {
  if (!convert) {
    var $container = this;
    var sig = '<div class="signatures signature' + count + '" style="position: absolute; padding:10px; background-color: rgba(1,1,1,0);">signature</div>'
    var $signature = $(sig);
    console.log('signature: ', $signature);
    console.log('container: ', $container.getBoundingClientRect());

    var xPosition = (e.clientX - $container.getBoundingClientRect().left) - ($signature.innerWidth() / 2);
    var yPosition = (e.clientY - $container.getBoundingClientRect().top) - ($signature.innerHeight() / 2);

    console.log('x: ', xPosition);
    console.log('y: ', yPosition);

     $signature
      .css({
        "left": xPosition + "px",
        "top": yPosition + "px"
      })
      .appendTo(this);
      count ++;
  }
}

$('.signature_container').click(addPlaceholder);
