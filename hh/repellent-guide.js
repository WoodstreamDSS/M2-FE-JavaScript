require(['jquery'], function($) {

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
