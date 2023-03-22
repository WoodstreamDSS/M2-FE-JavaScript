
require(['jquery'], function ($) {

  woodstream.CategorySlider = function (el) {
    this.el = el;
    this.id = el.attr('id');
    if (this.id == undefined) { this.id = 'ws-category-slider'; };
    this.panels = this.el.find('.panel');
    this.mask = this.el.find('.ws-cat-mask');
    this.wrap = this.el.find('.ws-cat-wrap');
    this.panelCount = this.panels.length;
    this.controls;
    this.visiblePanels = 5;
    this.panelWidth = 0;
    this.resizeTimer;
    this.touch;
    this.touchActive = false;
    this.load = true;

    this.updatePanelDimensions = function () {
      this.panelWidth = this.el.find('.panel').outerWidth(true);
      var maskWidth = this.mask.innerWidth();
      this.visiblePanels = Math.round(maskWidth / this.panelWidth);
    }

    this.touchHandler = function (obj) {
      if (this.touchActive && obj.status == 'end') {
        if (obj.xMove > 50) { this.prev(); }
        if (obj.xMove < -50) { this.next(); }
      }
    }.bind(this);

    this.init = function () {
      var prevCtrl = document.createElement('button');
      prevCtrl.classList.add('ws-cat-ctrl');
      prevCtrl.classList.add('prev');
      prevCtrl.appendChild(document.createTextNode('<'));
      prevCtrl.text
      var nextCtrl = document.createElement('button');
      nextCtrl.classList.add('ws-cat-ctrl');
      nextCtrl.classList.add('next');
      nextCtrl.appendChild(document.createTextNode('>'));
      this.el.prepend(prevCtrl);
      this.el.append(nextCtrl);
      this.controls = this.el.find('.ws-cat-ctrl');
      this.controls.attr('aria-controls', this.id);
      this.wrap.attr('role', 'tablist');
      this.panels.attr('role', 'tabpanel');
      this.controls.on('click', function (e) { this.clickHandler(e); }.bind(this));
      this.el.on('keyup', function (e) { this.keyHandler(e); }.bind(this));
      this.updatePanelDimensions();
      this.updateAria();
      $(document).ready(function () {
        var path = window.location.pathname;
        for (var i = 0; i < this.panels.length; i++) {
          var panelPath = this.panels.eq(i).find('a').attr('href');
          if (path.indexOf(panelPath) === 0) {
            this.panels.eq(i).addClass('active');
            this.adjust(i);
            break;
          }
        }
        if (this.load) {
          var dotw = this.wrap.find('.dotw');
          var lc = this.wrap.find('.lc').detach();
          dotw.prependTo(this.wrap);
          var lcIndex = this.visiblePanels - 1;
          if (this.visiblePanels < 3) { lcIndex = 2; }
          var lcSelector = this.wrap.find('.panel:nth-child(' + lcIndex + ')')
          lc.insertAfter(lcSelector);
          this.load = false;
        }
        if (woodstream.TouchObj) {
          this.touch = new woodstream.TouchObj(this.id, this.touchHandler);
        }
      }.bind(this));
    }

    this.adjust = function (idx) {
      for (var i = 0; i < idx; i++) {
        this.next(0);
      }
    }.bind(this);

    this.clickHandler = function (e) {
      if ($(e.currentTarget).hasClass('prev')) { this.prev(); };
      if ($(e.currentTarget).hasClass('next')) { this.next(); };
    }

    this.keyHandler = function (e) {
      if (e.which == 37) { this.prev(); }
      if (e.which == 39) { this.next(); }
    }

    this.prev = function (delay) {
      if (delay == undefined) { delay = 200; }
      if (!this.wrap.is(':animated')) {
        var lastPanel = this.wrap.find('.panel:last-child').clone(true);
        this.wrap.prepend(lastPanel).css('left', -1 * this.panelWidth);
        this.wrap.animate({ 'left': 0 }, delay, function () {
          this.wrap.find('.panel:last-child').remove();
          this.updateAria();
        }.bind(this));
      }
    }

    this.next = function (delay) {
      if (delay == undefined) { delay = 200; }
      if (!this.wrap.is(':animated')) {
        var firstPanel = this.wrap.find('.panel:first-child').clone(true);
        this.wrap.append(firstPanel).animate({ 'left': -1 * this.panelWidth }, delay, function () {
          this.wrap.find('.panel:first-child').remove();
          this.wrap.css('left', 0);
          this.updateAria();
        }.bind(this));
      }
    }

    this.updateAria = function () {
      // disable hidden links, update aria-hidden attributes

      this.wrap.find('.panel').attr('aria-hidden', true).find('a').attr('tabindex', -1);
      this.wrap.find('.panel:lt(' + this.visiblePanels + ')').attr('aria-hidden', false).find('a').attr('tabindex', 0);

      // if all panels are visible, turn off arrows

      if (this.visiblePanels == this.panelCount) { $(this.controls).hide(); } else { $(this.controls).show(); }

      // check whether mobile touch is active

      var docWidth = $(document).innerWidth();
      if (docWidth < 1280) { this.touchActive = true; } else { this.touchActive = false; }
    }

    $(window).on('resize', function () {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(function () {
        this.updatePanelDimensions();
        this.updateAria();
      }.bind(this), 250);
    }.bind(this))

    this.init();

  }

  $(document).ready(function () {
    var catSlider = $('.ws-cat-slider');
    if (catSlider.length > 0) {
      var currentSlider = new woodstream.CategorySlider(catSlider.eq(0));
    }
  });

});
