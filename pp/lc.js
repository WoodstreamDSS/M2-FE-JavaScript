require(['jquery'], function ($) {
  function mobileToggle() {
    var status = jQuery('.bl-mobile-nav ul').css('max-height');
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
