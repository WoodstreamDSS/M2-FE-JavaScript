require(['jquery'], function($) {

  var insectItems = $('.catch-wrap .inline-item');
  var mobileMode = false;
  if (window.innerWidth < 480) { switchMode(); }

  insectItems.mouseenter(function(e) {
    showContent(e.currentTarget, false);
  }).mouseleave(function(e) {
    if (!$(e.currentTarget).hasClass('open')) {
      hideContent(e.currentTarget, false);
    }
  });

  insectItems.on('click', function(e) {
    var open = $(e.currentTarget).hasClass('open');
    if (open) {
      $(e.currentTarget).removeClass('open');
      hideContent(e.currentTarget, true);
    } else {
      var openItem = $('.catch-wrap .inline-item.open');
      openItem.removeClass('open');
      openItem.find('.insect-desc').animate({'height':0}, 100);
      $(e.currentTarget).addClass('open');
      showContent(e.currentTarget, true);
    }
  });

  var showContent = function(el, video) {
    var desc = $(el).find('.insect-desc');
    var newHeight = desc[0].scrollHeight;
    desc.animate({'height':newHeight}, 100);
    if (video) {
      var videoId = $(el).attr('data-video-id');
      $('.advice-video .youtube-player').attr('data-id', videoId);
    }
  }

  var hideContent = function(el, video) {
    var desc = $(el).find('.insect-desc');
    desc.animate({'height':0}, 100);
    if (video) {
      var videoId = $(el).attr('data-video-id');
      console.log(videoId);
    }
  }

  function switchMode() {
    var catchWrap = $('.catch-wrap');
    var adviceVideo = $('.advice-video');
    if (mobileMode) {
      mobileMode = false;
      catchWrap.insertBefore(adviceVideo);
    } else {
      mobileMode = true;
      catchWrap.insertAfter(adviceVideo);
    }
  }

  $(window).on('resize', function() {
    if (window.innerWidth < 480 && !mobileMode) {
      switchMode();
    } else if (window.innerWidth > 479 && mobileMode) {
      switchMode();
    }
  });

});