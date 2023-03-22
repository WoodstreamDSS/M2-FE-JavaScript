require(['jquery'], function($) {

  let colWidth, colCount;
  let expanded = false;

  const setWidth = function() {
    let docWidth = window.innerWidth;
    if (docWidth <  480) { colWidth = 2; colCount = 3; }
    if (docWidth >= 480) { colWidth = 3; colCount = 3; }
    if (docWidth >= 640) { colWidth = 4; colCount = 2; }
    if (docWidth >= 960) { colWidth = 5; colCount = 2; }
    $('.animal-wrap').attr('data-cols',colWidth);
    if (!expanded) { showFewer(); }
  }

  const showFewer = function() {
    let numberToShow = colWidth * colCount;
    let blocks = $('.inline-item');
    for (let i = 0; i < blocks.length; i++) {
      if (i < numberToShow) {
        $(blocks[i]).attr({'aria-hidden':false});
        $(blocks[i]).find('a').attr({'tabindex':0});
      } else {
        $(blocks[i]).attr({'aria-hidden':true});
        $(blocks[i]).find('a').attr({'tabindex':-1});
      }
    }
    $('#show-control').text('Load More');
    expanded = false;
  }

  const showMore = function() {
    let blocks = $('.inline-item');
    for (let i = 0; i < blocks.length; i++) {
      $(blocks[i]).attr({'aria-hidden':false});
      $(blocks[i]).find('a').attr({'tabindex':0});
    }
    $('#show-control').text('Less');
    expanded = true;
  }

  setWidth();
  showFewer();

  $(window).on('resize', function() { setWidth(); });
  $('#show-control').on('click', function() {
    expanded == false ? showMore() : showFewer();
  });

});
