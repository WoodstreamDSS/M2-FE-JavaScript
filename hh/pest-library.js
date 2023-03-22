require(['jquery'], function($) {

  let colWidth;
  let expanded = false;

  const setWidth = function() {
    let docWidth = window.innerWidth;
    if (docWidth <  480) { colWidth = 2; colCount = 3; }
    if (docWidth >= 480) { colWidth = 3; colCount = 3; }
    if (docWidth >= 640) { colWidth = 4; colCount = 2; }
    if (docWidth >= 768) { colWidth = 5; colCount = 2; }
    if (docWidth >= 960) { colWidth = 6; colCount = 2; }
    let style = {'grid-template-columns':'repeat(' + colWidth + ', 1fr)'}
    $('.pest-library .animal-wrap').css(style);
    if (!expanded) { showFewer(); }
  }

  const showFewer = function() {
    let numberToShow = colWidth * colCount;
    let blocks = $('.animal-item');
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
    let blocks = $('.animal-item');
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
