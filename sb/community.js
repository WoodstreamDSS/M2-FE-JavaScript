

require(['jquery'], function ($) {

  var swapTab = function (el) {
    var idx = parseInt($(el).attr('data-idx'));
    for (var i = 0; i < blockSliders.length; i++) {
      if (i !== idx) { blockSliders[i].hide(); } else { blockSliders[i].show(); }
    }

    $('.community-tabs .home-tab-navigation ul li').removeClass('active');
    $(el).addClass('active');
    var showSlider = $('.community-tabs .home-tab-navigation ul li.active').attr('data-slider');

    var targetPanel = '#' + $(el).attr('aria-controls');
    $('.community-tabs .tab-panel').attr('aria-hidden', true);
    $(targetPanel).attr('aria-hidden', false);
  }

  $('.community-tabs .home-tab-navigation ul li').on('click', function () {
    swapTab(this);
  });

  var blockSliders = [];

  $(document).ready(function () {
    if ($('#ask-experts-slider').length > 0) { var expertSlider = new woodstream.BlockSlider('ask-experts-slider'); }
    blockSliders.push(new woodstream.BlockSlider('recipes-slider'));
    blockSliders.push(new woodstream.BlockSlider('coloring-slider'));
    blockSliders[1].hide();
  });

});