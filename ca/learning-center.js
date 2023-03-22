require(['jquery'], function($) {

  let lcSlider = new woodstream.BlockSlider('lc-nav');

  $('#lc-nav .panel').on('keyup', function(e) {
    if (e.which == 13 || e.which == 32) {
      clickHandler(this);
    }
  });

  $('#lc-nav .panel').on('click', function() {
    clickHandler(this);
  });

  const clickHandler = function(el) {
    $('#lc-nav .panel').attr({'aria-selected': 'false'});
    $('.category').attr({'aria-hidden': 'true'});
    $(el).attr('aria-selected', 'true');
    let target = $(el).attr('aria-controls');
    $(`#${target}`).attr('aria-hidden', 'false');
  }

});