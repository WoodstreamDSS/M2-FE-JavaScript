require(['jquery'], function($) {

  $('.trap-size-nav li').on('click', (e) => { navClick(e); });
  $('.trap-size-nav li').on('keyup', (e) => {
    if (e.which == 32 || e.which == 13)  { navClick(e); }
  });

  const navClick = function(e) {
    $('.trap-size-nav li').removeClass('active').attr('aria-selected',false);
    $(e.currentTarget).addClass('active').attr('aria-selected',true);
    let target = $(e.currentTarget).attr('aria-controls');
    $('.guide-panel').attr('aria-hidden',true);
    $(`#${target}`).attr('aria-hidden',false);

    // init won't work on tables not visible when page loads. So check to see if the minimum position is still zero when we switch to the tab. If minPos is 0, then we need to reset the table so it will scroll correctly.

    let idx = $(e.currentTarget).index();
    if (tableArray[idx].minPos == 0) { tableArray[idx].resizeHandler(); };
  }

  let sliderXS = new woodstream.BlockSlider('xs-slider');
  let sliderS =  new woodstream.BlockSlider('s-slider');
  let sliderM =  new woodstream.BlockSlider('m-slider');
  let sliderL =  new woodstream.BlockSlider('l-slider');
  let sliderXL = new woodstream.BlockSlider('xl-slider');

  $(document).ready(function() { $('.features .expand-item.open .question').click(); });

  woodstream.TableSlider = function(id) {
    this.id = id;
    this.el = $('#' + this.id);
    this.table = this.el.find('table');
    this.parent = this.table.parent();
    this.newPos = 0;
    this.pos = 0;
    this.minPos = 0;
    this.touch = null;
    this.scroll = false;

    this.setPosition = function() {
      if (this.newPos > 0) { this.newPos = 0; }
      if (this.newPos < this.minPos) { this.newPos = this.minPos; }
      this.table.css({'left':this.newPos});
    }

    this.checkScroll = function() {
      if (this.scroll) {
        if (this.newPos >= 0) { this.el.removeClass('left') }
        if (this.newPos <= this.minPos) { this.el.removeClass('right'); }
        if (this.newPos == 0) { this.el.addClass('right') }
        if (this.newPos > this.minPos && this.newPos < 0) { this.el.addClass('left right'); }
      } else {
        this.el.removeClass('right left');
      }
    }

    this.touchHandler = function(obj) {
      if (obj.status == 'move') {
        this.newPos = this.pos + obj.xMove;
        this.setPosition();
        this.checkScroll();
      }
      if (obj.status == 'end') {
        this.pos = this.newPos;
        this.newPos = 0;
      }
    }.bind(this);

    this.resizeHandler = function() {
      this.pos = 0;
      this.setPosition(0);
      this.setMinPos();
      if (this.minPos == 0) {
        this.scroll = false;
      } else {
        this.scroll = true;
      }
      this.checkScroll();
    }

    this.setMinPos = function() {
      let tableWidth = $(this.table).innerWidth();
      let parentWidth = $(this.parent).innerWidth();
      let minPos = parentWidth - tableWidth;
      if (minPos > 0) { minPos = 0; }
      this.minPos = minPos;
    }

    this.manualMove = function(amt) {
      this.newPos = this.pos + amt;
      this.setPosition();
      this.checkScroll();
      this.pos = this.newPos;
      this.newPos = 0;
    }

    this.init = function() {
      this.setMinPos();
      this.resizeHandler();
      this.touch = new woodstream.TouchObj(this.id, this.touchHandler);
      $(window).on('resize', () => { this.resizeHandler(); });
      $(this.el).on('keyup', (e) => {
        if (this.scroll) {
          if (e.which == 37) { this.manualMove(-50); }
          if (e.which == 39) { this.manualMove(50); }
        }
      }).bind(this);
    }.bind(this);

    this.init();

  }

  let tableCollection = $('.ws-table-slider');
  let tableArray;
  if (tableCollection.length > 0) {
    tableArray = [];
    tableCollection.each(function() {
      tableArray.push(new woodstream.TableSlider($(this).attr('id')) );
    });
  }

});