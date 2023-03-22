require(['jquery'], function($) {

  let featuresBlocks = new woodstream.BlockSlider('features-blocks');
  let placementSlider = new woodstream.BlockSlider('placement-slider');

  $('#feature-slider button.control').on('click', function() {
    $(this).hasClass('prev') ? prevImage() : nextImage();
  });

  const nextImage = function() {
    $('#feature-slider .wrap').animate({'margin-left':'-100vw'}, 250, function() {
      $('#feature-slider .panel:first-child').appendTo('#feature-slider .wrap');
      $('#feature-slider .wrap').css({'margin-left':'0'});
    });
  }

  const prevImage = function() {
    $('#feature-slider .wrap').css({'margin-left':'-100vw'});
    $('#feature-slider .panel:last-child').prependTo('#feature-slider .wrap');
    $('#feature-slider .wrap').animate({'margin-left':'0'}, 250);
  }

  const touchHandler = function(obj) {
    if (obj.status == 'end') {
      if (obj.xMove > 50) { prevImage(); }
      if (obj.xMove < -50) { nextImage(); }
    }
  }

  $('#feature-slider').on('keydown', function(e) {
    if (e.which == 37) { prevImage(); }
    if (e.which == 39) { nextImage(); }
  });

  const featureTouch = new woodstream.TouchObj('feature-slider', touchHandler);

  let arrowsVisible = [false, false, false];

  const updateArrows = function() {
    let windowHeight = window.innerHeight;
    if (!arrowsVisible.every(Boolean)) {
      arrows.each(function(i) {
        let arrowPos = this.getBoundingClientRect().y;
        if (arrowPos < (windowHeight * 0.66) && arrowPos !== 0) {
          $(this).animate({'opacity':1}, 500);
          arrowsVisible[i] = true;
        }
      });
    } else {
      $(window).off('scroll', updateArrows);
    }
  }

  let arrows = $('.placement img.arrow');
  $(window).on('scroll', updateArrows);

});