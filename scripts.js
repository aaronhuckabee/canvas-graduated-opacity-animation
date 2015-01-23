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
  intervalCrossfade,
  timeout,
  executeCanvasReveal,
  animationID,
  tabletPortrait = 768,
  slideshowSpeed = 9000,
  scrollBarWidth = 15,
  isMobile = ($(window).width() <= tabletPortrait - scrollBarWidth),
  isDesktop = ($(window).width() >= 1024 - scrollBarWidth);

$(function() {
  provideCoverImage();
  initializeFlexSlider();
  bindLearnMore();
  // prepares canvas element from downgrade images contained therein
  $('canvas').cprep();

  $(window).on('resize', function(){
    fullscreenSlideshow();
  });

  $('.hero').click(function() {
    executeCanvasReveal = true;
    beginSlideshow();
    revealGlory();
    fadePausePlay();
  });

});

function fadePausePlay() {
  $('.flexslider').mousemove(function() {
    $('.flex-pauseplay').fadeIn();

    clearTimeout(timeout);

    timeout = setTimeout(function() {
      $('.flex-pauseplay').fadeOut();
    }, 1000);
  });
}

function provideCoverImage(){
  src = $('.homepage .flexslider li').not('.clone').first().find('img').attr('src');
  $('.hero').css('background-image', 'url('+src+')');
}

function initializeFlexSlider(){
  if (isMobile) {
    slideshowSpeed = slideshowSpeed*1.5;
  }
  // activate flexslider
  $('.flexslider').flexslider({
    animation: 'slide',
    slideshow: false,
    animationLoop: false,
    controlNav: false,
    pausePlay: true,
    pauseText: '',
    playText: '',
    prevText: '',
    nextText: '',
    slideshowSpeed: slideshowSpeed,
    start: function(slider) {
      fullscreenSlideshow();
    },
    after: function(slider) {
      revealGlory(slider);
    },
    end: function(slider) {
      // reset slideshow
      setTimeout(function() {
        executeCanvasReveal = false;
        $(slider).flexslider(0);
        $('.hero').fadeIn('slow');
        if(isDesktop) {
          $('.callout').fadeIn('slow');
        }
      }, 9000);
    }
  });
}

function bindLearnMore(){
  $('#home-page-gallery .learn-more').click(function() {
    $('html, body').animate({
      scrollTop: $('#home-page-gallery').offset().top + $('#home-page-gallery').height()
    }, 1000);
    $('.flexslider').flexslider('pause');
  });
}

function fullscreenSlideshow() {
  var hh = $('header').height(),
    wh = $(window).height();

  if(isDesktop) {
    $('.flexslider').height(wh - hh);
  }
  else {
    $('.flexslider').height('auto');
  }
}

function beginSlideshow() {
  $('.flexslider').flexslider(0);
  $('.hero').fadeOut('slow');
  $('.flexslider').flexslider('play');
  if(isDesktop) {
    $('.callout').fadeOut('slow');
  }
}

// initiates slide on each page
function revealGlory(slider) {
  var id, currentSlide;

  if(executeCanvasReveal) {
    if(slider) {
      currentSlide = slider.currentSlide;
      id = slider.slides[currentSlide].firstElementChild.id;
    } else {
      id = 'canvas1';
    }
    x = 0;

    // mobile devices need faster rendering
    if (isMobile) {
      seconds = 2.5;
      offset = 300;
    }
    else {
      seconds = 5;
      offset = 500;
    }

    afterImage = new Image();
    beforeImage = new Image();
    $('canvas:not(#' + id + ')').cprep();

    if (isMobile) {
      afterImage.src = $('#' + id + ' img').attr('low-res-after');
      beforeImage.src = $('#' + id + ' img').attr('low-res-before');
    } else {
      afterImage.src = $('#' + id + ' img').attr('src');
      beforeImage.src = $('#' + id + ' img').attr('data-pic');
    }
    ctx = document.getElementById(id).getContext('2d');

    beforeImage.onload = function() {
      // clearInterval(intervalCrossfade);
      // mobile devices need faster rendering
      // if (isMobile) {
      //   intervalCrossfade = setInterval(crossfade,0.0001);
      // }
      // else {
      //   intervalCrossfade = setInterval(crossfade,1000/60);
      // }
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
    // ctx.drawImage(afterImage, 0, 0);
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
    if (isMobile) {
      beforeImage.src = $('img', this).attr('low-res-before');  // before image
    } else {
      beforeImage.src = $('img', this).attr('data-pic');  // before image
    }
    beforeImage.onload = function(){
      ctx.canvas.height = beforeImage.height;
      ctx.canvas.width = beforeImage.width;
      ctx.drawImage(beforeImage,0,0);
    };
  }
};
