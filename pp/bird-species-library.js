require(['jquery'], function ($) {
  var sliderMaxWidth = 1050;
  var sliderArray = [];
  var sliderResize = function () {
    var numberOfSliders = sliderArray.length;
    for (var i = 0; i < numberOfSliders; i++) {
      var sliderId = '#slider-' + i;
      sliderArray[i].numberOfItems = $(sliderId + ' .icon-wrapper').length;
      var currentWidth = $(sliderId + ' .slider-wrap').outerWidth(true);
      currentWidth -= 62; /* compensate for navigation */
      if (currentWidth > sliderMaxWidth) {
        currentWidth = sliderMaxWidth;
      }
      var totalWidth = sliderArray[i].numberOfItems * sliderArray[i].itemWidth;
      sliderArray[i].visible = Math.floor(
        currentWidth / sliderArray[i].itemWidth
      );
      var visibleWidth = sliderArray[i].visible * sliderArray[i].itemWidth;

      if (sliderArray[i].numberOfItems <= sliderArray[i].visible) {
        $(sliderId + ' .controls').css({ visibility: 'hidden' });
        $(sliderId + ' .icon-wrap').css({ 'margin-left': 'auto' });
        sliderArray[i].index = 0;
      } else {
        $(sliderId + ' .controls').css({ visibility: 'visible' });
      }

      if (
        sliderArray[i].index + sliderArray[i].visible >
          sliderArray[i].numberOfItems &&
        sliderArray[i].numberOfItems > sliderArray[i].visible
      ) {
        bump(i);
      }

      $(sliderId + ' .icon-wrap').css({ width: totalWidth });
      $(sliderId + ' .slider-wrap').css({ width: visibleWidth });
      checkNav(i);
    }
  };
  function bump(id) {
    var bumpAmount =
      sliderArray[id].index +
      sliderArray[id].visible -
      sliderArray[id].numberOfItems;
    var tempIndex = sliderArray[id].index - bumpAmount;
    var sliderId = '#slider-' + id;
    var currentOffset = parseInt(
      $(sliderId + ' .icon-wrap').css('margin-left'),
      10
    );
    var sliderOffset =
      currentOffset -
      (tempIndex - sliderArray[id].index) * sliderArray[id].itemWidth;
    var slideSpeed = 100 * (tempIndex - sliderArray[id].index);
    $(sliderId + ' .icon-wrap').animate(
      { 'margin-left': sliderOffset },
      slideSpeed
    );
    sliderArray[id].index = tempIndex;
  }
  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
  function checkNav(id) {
    var sliderId = '#slider-' + id;
    var maxIndex = sliderArray[id].numberOfItems - sliderArray[id].visible;
    $(sliderId + ' .slider-control').removeClass('disabled');
    if (sliderArray[id].index == maxIndex) {
      $(sliderId + ' .right-control').addClass('disabled');
      $(sliderId + ' .right-one-control').addClass('disabled');
    }
    if (sliderArray[id].index == 0) {
      $(sliderId + ' .left-control').addClass('disabled');
      $(sliderId + ' .left-one-control').addClass('disabled');
    }
  }
  function rightControl(id, mode) {
    if (!$('.icon-wrap').is(':animated')) {
      var sliderId = '#slider-' + id;
      var maxIndex = sliderArray[id].numberOfItems - sliderArray[id].visible;
      if (mode == 0) {
        var tempIndex = sliderArray[id].index + sliderArray[id].visible;
      } else if (mode == 1) {
        var tempIndex = sliderArray[id].index + 1;
      }
      if (tempIndex >= maxIndex) {
        tempIndex = maxIndex;
      }
      var slideSpeed = 100 * (tempIndex - sliderArray[id].index);
      var currentOffset = parseInt(
        $(sliderId + ' .icon-wrap').css('margin-left'),
        10
      );
      var sliderOffset =
        currentOffset -
        (tempIndex - sliderArray[id].index) * sliderArray[id].itemWidth;
      $(sliderId + ' .icon-wrap').animate(
        { 'margin-left': sliderOffset },
        slideSpeed
      );
      sliderArray[id].index = tempIndex;
      checkNav(id);
    }
  }
  function leftControl(id, mode) {
    if (!$('.icon-wrap').is(':animated')) {
      var sliderId = '#slider-' + id;
      if (mode == 0) {
        var tempIndex = sliderArray[id].index - sliderArray[id].visible;
      } else if (mode == 1) {
        var tempIndex = sliderArray[id].index - 1;
      }
      if (tempIndex <= 0) {
        tempIndex = 0;
      }
      var slideSpeed = 100 * (sliderArray[id].index - tempIndex);
      var currentOffset = parseInt(
        $(sliderId + ' .icon-wrap').css('margin-left'),
        10
      );
      var sliderOffset =
        currentOffset +
        (sliderArray[id].index - tempIndex) * sliderArray[id].itemWidth;
      $(sliderId + ' .icon-wrap').animate(
        { 'margin-left': sliderOffset },
        slideSpeed
      );
      sliderArray[id].index = tempIndex;
      checkNav(id);
    }
  }

  function initializeSliders() {
    var sliderCount = $('.slider-container').length;
    for (var i = 0; i < sliderCount; i++) {
      sliderArray[i] = {};
    }
    for (var i = 0; i < sliderCount; i++) {
      var sliderId = '#slider-' + i;
      var sliderItemWidth = parseInt($(sliderId).attr('data-item-width'), 10);
      sliderArray[i].id = i;
      sliderArray[i].itemWidth = sliderItemWidth;
      sliderArray[i].visible = 0;
      sliderArray[i].numberOfItems = 0;
      sliderArray[i].index = 0;
    }
  }

  $(document).ready(function () {
    initializeSliders();
    sliderResize();
  });
  $(window).on('resize', debounce(sliderResize, 250));

  $('.controls .left-control').on('click', function () {
    var id = parseInt($(this).attr('data-id'));
    leftControl(id, 0);
  });

  $('.controls .right-control').on('click', function () {
    var id = parseInt($(this).attr('data-id'));
    rightControl(id, 0);
  });
});
