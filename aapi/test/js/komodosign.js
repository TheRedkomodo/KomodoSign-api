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
var convert = true;
var bodyClickable = true;
$('body').on('click', '#add', function(){
  convert = false;
})
var currentPopover;

var pageCount = $('.pc');
console.log('page count: ',pageCount.length);
var count = 1;
var signature_container = '<div class="signature_container"></div>';
$('.pc').prepend(signature_container);

// adds Recipient to placeholder
var addRecipient = function(elementIdentifier, recipientName, recipientId) {
  var type = typeof elementIdentifier;
  console.log('typeof elementIdentifier: ', elementIdentifier + ' | ' +  type);
  $("." + elementIdentifier).text(recipientName.toString() + "'s signature")
  $("." + elementIdentifier).addClass(recipientId);

  currentPopover = $("." + elementIdentifier);
  setTimeout(function(){convert = false; bodyClickable = false}, 500)
}

// prepends recipientDropdown to placeholder
var prependRecipientDropdown = function($element, recipients) {
  var dropdownBtn = '<button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Add Signee</button>'

  var dropdownMenu = '<div class="dropdown-menu" aria-labelledby="dropdownMenuButton">';
  console.log('$element: ',  $element.attr('class').split(" ")[2]);

  var elementIdentifier = "'" + $element.attr('class').split(" ")[2] + "'";

  recipients.forEach(function(recipient) {
    var recipientName = "'" + recipient.name + "'"
    recipientId = "'" + recipient.id + "'"
    var onclick = 'addRecipient(' + elementIdentifier + ', ' + recipientName + ', ' + recipientId + ')';
    dropdownMenu += '<div id="' + recipient.id + '" onclick="' + onclick;
    dropdownMenu += '" class="dropdown-item" href="#">' + recipient.name + '</div>';
  })

  dropdownMenu += '</div>';

  var dropdown = '<div class="dropdown">';
  dropdown += dropdownBtn;
  dropdown += dropdownMenu;
  dropdown += '</div>';

  // initialize popover
  $("." + $element.attr('class').split(" ")[2]).popover({
    html: true,
    content: dropdown,
    title:'MUFASA'
  });

  currentPopover.popover('show')
}


var addPlaceholder = function(e) {
  if (!convert && bodyClickable) {
    var $container = this;
    var sig = '<a tabindex="0" role="button" class="btn signatures signature' + count + '" style="position: absolute; padding:10px; background-color: rgba(1,1,1,0);" data-container="body" data-toggle="popover" data-placement="top">signature</a>'
    var $signature = $(sig);
    console.log('signature: ', $signature);
    console.log('container: ', $container.getBoundingClientRect());

    var xPosition = (e.clientX - $container.getBoundingClientRect().left) - ($signature.innerWidth() / 2);
    var yPosition = (e.clientY - $container.getBoundingClientRect().top) - ($signature.innerHeight() / 2);

    console.log('x: ', xPosition);
    console.log('y: ', yPosition);
    console.log('recipients: ', recipients);

    currentPopover = $signature;
     $signature
      .css({
        "left": xPosition + "px",
        "top": yPosition + "px"
      })
      .appendTo(this);
      count ++;
      prependRecipientDropdown($signature, window.recipients);
      convert = true
  }

  if(!bodyClickable) {
    currentPopover.popover('hide')
    bodyClickable = true
  }

}


$('.signature_container').click(addPlaceholder);
