require(['jquery'], function ($) {
  let currentIndex = 0;
  let currentOffset = 0;
  let sliderMode = false;
  let minLeft = 0;
  let touchObj;

  const touchHandler = (obj) => {
    let offset;
    if (sliderMode && obj.status == 'move') {
      offset = currentOffset + obj.xMove;
      if (offset > 0) {
        offset = 0;
      }
      if (offset < minLeft) {
        offset = minLeft;
      }
      $('.data-wrap').css('left', offset);
    }

    if (sliderMode && obj.status == 'end') {
      currentOffset = currentOffset + obj.xMove;

      if (currentOffset > 0) {
        currentOffset = 0;
      }
      if (currentOffset < minLeft) {
        currentOffset = minLeft;
      }

      let colWidth = $('.data-wrap div[role="cell"]').innerWidth();
      let currentIndex = parseInt(
        (-1 * currentOffset + colWidth / 2) / colWidth
      );

      currentOffset = -1 * (colWidth * currentIndex);
      $('.data-wrap').animate({ left: currentOffset }, 200);
      updateControls();
    }
  };

  if (woodstream.TouchObj) {
    touchObj = new woodstream.TouchObj('product-comparison', touchHandler);
  }

  const updateControls = () => {
    let nextStatus = currentOffset == minLeft ? true : false;
    let prevStatus = currentOffset == 0 ? true : false;
    $('.slide-table .controls button.next').attr('aria-hidden', nextStatus);
    $('.slide-table .controls button.prev').attr('aria-hidden', prevStatus);
  };

  const updateSlider = () => {
    sliderMode = window.innerWidth < 960;
    if (sliderMode) {
      minLeft =
        ($('.data-wrap').innerWidth() - $('.data-mask').innerWidth()) * -1;
    } else {
      minLeft = 0;
    }
    updateControls();
  };

  $('.slide-table .controls button').on('click', (e) => {
    let colWidth = $('.data-wrap div[role="cell"]').innerWidth();
    let newOffset = currentOffset;
    console.log(e.currentTarget);
    $(e.currentTarget).hasClass('prev')
      ? (newOffset += colWidth)
      : (newOffset -= colWidth);

    if (newOffset < minLeft) {
      newOffset = minLeft;
    }
    if (newOffset > 0) {
      newOffset = 0;
    }
    currentOffset = newOffset;
    $('.data-wrap').animate({ left: currentOffset }, 250, () => {
      updateControls();
    });
  });

  $(window).on('resize', () => {
    updateSlider();

    $('.data-wrap').css('left', 0);
    currentOffset = 0;
  });

  updateSlider();
});
