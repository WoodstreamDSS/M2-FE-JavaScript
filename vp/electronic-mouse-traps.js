
require(['jquery'], function($) {

  var startX, currentX, origin, newLeft, amtMoved;
  var mouseDown = false;
  var target = $('.sk-compare-table table');
  var maxLeft = (-1 * (parseInt(target.innerWidth()) - window.innerWidth)) - 20;

  target[0].addEventListener('touchstart', function(e) {
      maxLeft = -1 * (parseInt(target.innerWidth()) - window.innerWidth);
      startX = parseInt(e.changedTouches[0].pageX);
      origin = parseInt(target.css('left'));
      if (isNaN(origin)) { origin = 0; }
  });

  target[0].addEventListener('touchmove', function(e) {
      currentX = parseInt(e.changedTouches[0].pageX);
      amtMoved = currentX - startX;
      newLeft = origin + amtMoved;
      slideTable(newLeft);
  });

  target[0].addEventListener('mousedown', function(e) {
      startX = parseInt(e.clientX);
      mouseDown = true;
      origin = parseInt(target.css('left'));
  });

  target[0].addEventListener('mousemove', function(e) {
      if (mouseDown === true) {
          currentX = parseInt(e.clientX);
          amtMoved = currentX - startX;
          newLeft = origin + amtMoved
          slideTable(newLeft);
      }
  });

  target[0].addEventListener('mouseup', function(e) {
      startX = 0;
      mouseDown = false;
  });

  function slideTable(newLeft) {
      if (newLeft > 0) {
          newLeft = 0;
      }
      if (newLeft < maxLeft) {
          newLeft = maxLeft;
      }
      if (window.innerWidth <= 580) {
          $(target).css({'left':newLeft});
      }
  }

  $(window).resize(function() {
      maxLeft = (-1 * (parseInt(target.innerWidth()) - window.innerWidth)) - 40;
      $(target).css({'left':0});
  });

});
