require(['jquery'], function($) {

  woodstream.SBBlockSlider = function(el) {
    this.el = el;
    this.id = $('#' + this.el);
    this.panelCount = this.id.find('.panel').length;
    this.mask = this.id.find('.slider-mask');
    this.wrap = this.id.find('.slider-wrap');
    this.sliderWidth = 0;
    this.maskWidth = 0;
    this.panelWidth = 0;
    this.visible = 0;
    this.controls = this.id.find('.control');
    this.scroll = true;

    this.recalc = function() {
      this.sliderWidth = this.id.innerWidth();
      this.panelWidth = Math.ceil(this.id.find('.panel').eq(0).outerWidth(true));
      this.visible = Math.floor(this.sliderWidth / this.panelWidth);
      this.maskWidth = this.visible * this.panelWidth;
      this.mask.css({'width':this.maskWidth});

      if (this.panelCount <= this.visible) {
        this.controls.hide().attr('aria-hidden',true);
        this.scroll = false;
      } else {
        this.controls.show().attr('aria-hidden',false);
        this.scroll = true;
      }
    }

    this.prev = function() {
      this.wrap.finish();
      if (!this.wrap.is(':animated') && this.scroll) {
        this.wrap.css({'left':-1 * this.panelWidth});
        this.id.find('.panel:last-child').clone().prependTo(this.wrap);
        this.wrap.animate({'left':0}, 250, function() {
          this.id.find('.panel:last-child').remove();
          this.updateAria();
        }.bind(this));
      }
    }

    this.next = function() {
      this.wrap.finish();
      if (!this.wrap.is(':animated') && this.scroll) {
        this.id.find('.panel:first-child').clone().appendTo(this.wrap);
        this.wrap.animate({'left':-1 * this.panelWidth}, 250, function() {
          this.id.find('.panel:first-child').remove();
          this.wrap.css({'left':0});
          this.updateAria();
        }.bind(this));
      }
    }

    this.controls.on('click', function(e) {
      var target = $(e.target);
      if (target.hasClass('prev')) {
        this.prev();
      } else if (target.hasClass('next')) {
        this.next();
      }
    }.bind(this));

    this.updateAria = function() {
      var panels = this.wrap.children('.panel');
      panels.attr('aria-hidden', true);
      panels.slice(0, this.visible).attr('aria-hidden', false);
    }

    $(window).on('resize', function() {
      this.recalc();
      this.updateAria();
    }.bind(this));

    this.count = 0;
    var target = null;

    this.touchHandler = function(obj) {
      if (this.scroll) {
        if (obj.status == 'start') {
          this.count = 0;
          target = $(obj.e.currentTarget);
          target.on('click', function() { return false; }); // turns off target element
        }
        if (obj.status == 'move') {
          var additionalOffset = 0;
          additionalOffset = (this.count * this.panelWidth);
          this.wrap.css({'left':obj.xMove - additionalOffset});
          if (obj.xMove > 0 + (this.count * this.panelWidth)) {
            this.id.find('.panel:last-child').prependTo(this.wrap);
            this.count ++;
          } if (obj.xMove < (-1 * this.panelWidth) + (this.count * this.panelWidth)) {
            this.id.find('.panel:first-child').appendTo(this.wrap);
            this.count --;
          }
        }
        if (obj.status == 'end') {
          if (obj.xMove >= 5) {
            this.wrap.animate({'left':0}, 250);
          } else if (obj.xMove <= -5) {
            this.wrap.animate({'left':-1 * this.panelWidth}, 250, function() {
              this.id.find('.panel:first-child').appendTo(this.wrap);
              this.wrap.css({'left':0});
            }.bind(this));
          }
          if (obj.xMove > -5 && obj.xMove < 5) {
            target.off('click'); // turns target element back on
          }
        }
      }
    }.bind(this);

    if (woodstream.TouchObj) {
      this.touchEvent = new woodstream.TouchObj(this.el, this.touchHandler);
    } else {
      console.error('touch object module unavailable');
    }

    this.recalc();
    this.updateAria();
  }

  woodstream.ReadMoreFade = function(el, maxHeight, buttonLabelOpen, buttonLabelClosed, idx) {
    this.el = el;
    this.idx = idx;
    this.open = false;
    if (maxHeight === undefined) { this.maxHeight = 360; } else { this.maxHeight = maxHeight; }
    if (buttonLabelOpen === undefined) { this.buttonLabelOpen = 'Read More'; } else { this.buttonLabelOpen = buttonLabelOpen; }
    if (buttonLabelClosed === undefined) { this.buttonLabelclosed = 'Read Less'; } else { this.buttonLabelClosed = buttonLabelClosed; }

    this.el.css({'overflow':'hidden', 'height':this.maxHeight, 'position':'relative', 'padding-bottom':'50px'});

    var button = document.createElement('span');
    $(button).attr('class','read-more-fade-button id' + this.idx).text(this.buttonLabelOpen);
    var gradient = document.createElement('div');
    $(gradient).attr('class','read-more-fade-gradient');

    this.el.append(button);
    this.el.append(gradient);
    this.button = this.el.find('.read-more-fade-button');
    this.button.on('click', function() {
      if (this.open === false) {
        var newHeight = this.el[0].scrollHeight;
        this.el.find('.read-more-fade-gradient').fadeOut(250);
        this.el.animate({'height':newHeight}, 250, function() {
          this.el.css({'height':'auto'});
          this.open = true;
          this.button.text(this.buttonLabelClosed);
        }.bind(this));
      } else {
        this.el.find('.read-more-fade-gradient').fadeIn(250);
        this.el.animate({'height':this.maxHeight}, 250, function() {
          this.button.text(this.buttonLabelOpen);
          this.open = false;
        }.bind(this));
      }
    }.bind(this));
  }

  if ($('#insect-library-slider').length > 0) { var insectLibrarySlider = new woodstream.SBBlockSlider('insect-library-slider'); }
  if ($('#plant-disease-slider').length > 0) { var insectLibrarySlider = new woodstream.SBBlockSlider('plant-disease-slider'); }
  if ($('#featured-articles-slider').length > 0) { var featuredArticlesSlider = new woodstream.SBBlockSlider('featured-articles-slider'); }

  var readMoreElements = $('.read-more-fade');

  if (readMoreElements.length > 0) {
    var readMoreCollection = [];
    readMoreElements.each(function(idx) {
      readMoreCollection.push(new woodstream.ReadMoreFade($(this), 360, 'Read More', 'Read Less', idx));
    });
  }

  woodstream.TableSlider = function(id) { // pass this the text of the item's id
    this.id = id;
    this.el = $('#' + this.id);
    this.slideActive = false;
    this.currentLeft = 0;
    this.table = this.el.find('>table');
    this.maxLeft = 0;

    var wrapWidth = this.el.innerWidth();
    var tableWidth = this.table.innerWidth();
    if (wrapWidth < tableWidth) { this.slideActive = true; }

    this.checkHighlight = function() {
      this.el.addClass('left-grad right-grad');
      if (this.currentLeft === 0) {
        this.el.removeClass('left-grad');
      } else if (this.currentLeft === this.maxLeft) {
        this.el.removeClass('right-grad');
      }
    }

    this.touchHandler = function(obj) {
      if (this.slideActive === true) {
        if (obj.status == 'move') {
          var newLeft = this.currentLeft + obj.xMove;
          if (newLeft > 0) { newLeft = 0; }
          if (newLeft < this.maxLeft) { newLeft = this.maxLeft; }
          this.table.css({'left':newLeft});
        }
        if (obj.status == 'end') {
          this.currentLeft = parseInt(this.table.css('left'));
          this.checkHighlight();
        }
      }
    }.bind(this);

    $(window).on('resize', function() {
      this.table.css({'left':0});
      var wrapWidth = this.el.innerWidth();
      var tableWidth = this.table.innerWidth();
      if (wrapWidth < tableWidth) {
        this.slideActive = true;
        this.setMaxLeft();
        this.checkHighlight();
      } else {
        this.el.removeClass('left-grad right-grad');
        this.slideActive = false;
      }
    }.bind(this));

    this.touch = new woodstream.TouchObj(this.id, this.touchHandler);

    this.setMaxLeft = function() {
      var maskWidth = this.el.innerWidth();
      var tableWidth = this.table.innerWidth();
      this.maxLeft = maskWidth - tableWidth;
    }
    this.setMaxLeft();
    this.checkHighlight();
  }

  if ($('.sblc-table-wrap').length > 0) {
    var tables = $('.sblc-table-wrap');
    var tableCollection = [];
    tables.each(function() {
      var id = $(this).attr('id');
      tableCollection.push(new woodstream.TableSlider(id));
    });
  }

  var recHandler = function(obj) {
    var width = window.innerWidth;
    if (width <= 480) {
      if (obj.status == 'end') {
        if (obj.xMove > 20) {
          $('#lc-recommender .jcarousel-prev.jcarousel-control-prev').trigger('click');
        }
        if (obj.xMove <-20) {
          $('#lc-recommender .jcarousel-next.jcarousel-control-next').trigger('click');
        }
      }
    }
  }

  if ($('.lc-product-rec').length > 0) {
    $('.lc-product-rec').eq(0).attr('id','lc-recommender');
    var rec = new woodstream.TouchObj('lc-recommender', recHandler);
  }

  $(document).ready(function() {
    if ($('.sblc-left-col .menu-content').length > 0) {
      var content = $('.sblc-left-col .menu-content').clone(true);
      $('.mobile-sidebar').html(content);
    }
  });

});