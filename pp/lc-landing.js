require(['jquery'], function ($) {
  $('#lc-navigation').on('change', function () {
    var newLocation = $('#lc-navigation option:selected').val();
    window.location.href = newLocation;
  });

  $('#lc-navigation').on('change', function () {
    var newLocation = $('#lc-navigation option:selected').val();
    window.location.href = newLocation;
  });

  if ($('#article-slider').length > 0) {
    let articleSlider = new woodstream.BlockSlider('article-slider');
  }

  if ($('#pp-lc-slider').length > 0) {
    let lcSlider = new woodstream.LearningCenterSlider('pp-lc-slider');
  }

  // Mobile Left Nav Toggle

  function mobileToggle() {
    let status = $('.bl-mobile-nav ul').css('max-height');
    if (status == '0px') {
      $('.bl-mobile-nav ul').css({ 'max-height': '300px' });
      $('.mobile-arrow').addClass('open');
    } else {
      closeMobileMenu();
    }
  }

  function closeMobileMenu() {
    $('.bl-mobile-nav ul').css({ 'max-height': '0px' });
    $('.mobile-arrow').removeClass('open');
  }

  $(document).on('scroll', function () {
    closeMobileMenu();
  });

  $(window).resize(function () {
    closeMobileMenu();
  });

  $('#mobileToggle').on('click', function () {
    mobileToggle();
  });
});
