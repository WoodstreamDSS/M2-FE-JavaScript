require(['jquery'], function($) {

  $('.panel img').on('dragstart', false);

  var active = false;
  var bsSlider = new woodstream.TouchObj('bs-slider', bsSliderHandler);
  var slider = $('#bs-slider .bs-slider-wrap');
  var threshhold;
  setThreshhold();

  function setThreshhold() {
    var winWidth = window.innerWidth;
    if (winWidth > 1920) { winWidth = 1920; }
    threshhold = winWidth / 4;
  }

  function bsSliderHandler(obj) {
    if (obj.status == 'start') {
      // do things related to start of touch interaction
    }
    if (obj.status == 'move') {
      slider.css({'left': obj.xMove});
    }
    if (obj.status == 'end') {
      if (obj.xMove > threshhold) {
        if (active === false) {
          active = true;
          previousPanel();
        }
      } else if (obj.xMove < (-1 * threshhold)) {
        if (active === false) {
          active = true;
          nextPanel();
        }
      } else {
        slider.animate({'left':0}, 250);
      }
    }
  }

  function previousPanel() {
    var winWidth = window.innerWidth;
    if (winWidth > 1920) { winWidth = 1920; }
    slider.animate({'left':winWidth}, 250, function() {
      slider.prepend(slider.find('.panel:last-child'));
      slider.css({'left':0});
      active = false;
    });
  }
  function nextPanel() {
    var winWidth = window.innerWidth;
    if (winWidth > 1920) { winWidth = 1920; }
    winWidth = -1 * winWidth;
    slider.animate({'left':winWidth}, 250, function() {
      slider.append(slider.find('.panel:first-child'));
      slider.css({'left':0});
      active = false;
    });
  }

  $('#bs-slider .control.prev').on('click', function() {
    if (active === false) {
      active = true;
      previousPanel();
    }
  });
  $('#bs-slider .control.next').on('click', function() {
    if (active === false) {
      active = true;
      nextPanel();
    }
  });

  $(window).on('resize', setThreshhold);

  $('.video-cta').on('click', function() {
    $('.modal-item').fadeIn(250);
  });
  $('.modal-screen').on('click', function() {
    $('.modal-item').fadeOut(250);
    var el_src = $('#rodenticide-video iframe').attr("src");
    var newSrc = el_src.replace('autoplay=1', 'autoplay=0');
    $('#rodenticide-video iframe').attr("src", newSrc);
  });

});
