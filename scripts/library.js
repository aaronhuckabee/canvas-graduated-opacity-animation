$(function() {
  $('canvas').cprep();
  $('.start').click(function() {
    executeCanvasReveal = true;
    revealGlory();
  });
});

(function() {
  var lastTime = 0;
  var vendors = ['webkit', 'moz'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); },
        timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());

var beforeImage,
  afterImage,
  executeCanvasReveal,
  seconds = 9,
  offset = 300,
  //tabletPortrait = 768,
  //scrollBarWidth = 15,
  //isMobile = ($(window).width() <= tabletPortrait - scrollBarWidth),
  animationID;


function revealGlory(slider) {
  var id;
  if(executeCanvasReveal) {
    id = 'canvas1';
    x = 0;

    afterImage = new Image();
    beforeImage = new Image();
    //$('canvas:not(#' + id + ')').cprep(); // this will be necssary to clear other canvases if using in slideshow

    afterImage.src = $('#' + id + ' img').attr('src');
    beforeImage.src = $('#' + id + ' img').attr('bw-before');
    ctx = document.getElementById(id).getContext('2d');

    beforeImage.onload = function() {
      requestAnimationFrame(crossfade);
      ctx.drawImage(beforeImage, 0, 0);
    };
  }
}

function crossfade() {
  if (afterImage.complete) {
    // ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    var linearGradient = ctx.createLinearGradient(x-offset, 0, x, 0);
    linearGradient.addColorStop(0,"#000");
    linearGradient.addColorStop(1,  "transparent");
    ctx.drawImage(beforeImage, 0, 0);
    ctx.drawImageGradient(afterImage, 0, 0, linearGradient);

    if (x > ctx.canvas.width + offset) {
      cancelAnimationFrame(animationID);
      return  "";
    }
    x += ctx.canvas.width*60/(1000*seconds);
  }
  animationID = requestAnimationFrame(crossfade);
}

$.fn.cprep = function() {
  if (window.CanvasRenderingContext2D) {
    return this.each(cprep2);
  }
  function cprep2() {
    var ctx = $(this).get(0).getContext('2d');
    var beforeImage = new Image();
    beforeImage.src = $('img', this).attr('bw-before');  // before image
    beforeImage.onload = function(){
      ctx.canvas.height = beforeImage.height;
      ctx.canvas.width = beforeImage.width;
      ctx.drawImage(beforeImage,0,0);
    };
  }
};
