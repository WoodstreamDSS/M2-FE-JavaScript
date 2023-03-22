require(['jquery'], function ($) {
  woodstream.LearningCenterSlider = function (el) {
    this.id = $('#' + el);
    this.el = el;
    this.panels = this.id.find('.bird-lc-banner');
    this.panelCount = this.panels.length;
    this.autoplay = true;
    this.pause = 10000;
    this.idx = 0;
    this.touch = null;
    console.log(this.touch);
    this.updateAria = function () {
      this.panels.attr({ 'aria-hidden': 'true' });
      $(this.panels[this.idx]).attr({ 'aria-hidden': 'false' });
      this.panels.find('a').attr('tabindex', -1);
      $('.bird-lc-banner.active').find('a').attr('tabindex', 0);
    };
    this.touchHandler = function (obj) {
      let newIndex = null;
      if (obj.status == 'end') {
        if (obj.xMove > 50) {
          newIndex = this.idx - 1;
        }
        if (obj.xMove < -50) {
          newIndex = this.idx + 1;
        }
        if (newIndex > this.panelCount - 1) {
          newIndex = 0;
        }
        if (newIndex < 0) {
          newIndex = this.panelCount - 1;
        }
        if (newIndex) {
          this.showPanel(newIndex);
        }
      }
    }.bind(this);
    this.updateNav = function () {
      $('.nav-dots li').removeClass('active');
      $('.nav-dots li:nth-child(' + (this.idx + 1) + ')').addClass('active');
    };
    this.navHandler = function (target) {
      var newIdx = parseInt($(target).attr('data-idx'));
      this.showPanel(newIdx);
    };
    this.showPanel = function (newIdx) {
      if (newIdx != this.idx) {
        var activePanel = $(this.panels[this.idx]);
        var onDeckPanel = $(this.panels[newIdx]);
        onDeckPanel.addClass('on-deck').show().css({ opacity: 1 });
        this.idx = newIdx;
        this.updateNav();
        activePanel.animate(
          { opacity: 0 },
          250,
          function () {
            this.panels.removeClass('active');
            onDeckPanel.removeClass('on-deck').addClass('active');
            this.updateAria();
          }.bind(this)
        );
      }
    };
    this.init = function () {
      var navDots = $(document.createElement('nav'));
      navDots.addClass('nav-dots');
      var navList = $(document.createElement('ul'));
      navList.appendTo(navDots);
      for (var x = 0; x < this.panelCount; x++) {
        var navDot = $(document.createElement('li'));
        var navDotLink = $(document.createElement('button'));
        navDotLink.attr({ 'data-idx': x });
        $(this.panels[x]).attr('id', 'panel-' + x);
        navDotLink.attr({ 'aria-controls': 'panel-' + x });
        navDotLink.appendTo(navDot);
        if (x == 0) {
          navDot.addClass('active');
        }
        navDot.appendTo(navList);
      }
      navDots.appendTo(this.id);
      this.updateAria();
      this.navDots = this.id.find('.nav-dots button');
      this.navDots.on(
        'click',
        function (e) {
          this.navHandler(e.target);
        }.bind(this)
      );
      this.id.on(
        'keydown',
        function (e) {
          if (e.key == 'ArrowLeft') {
            var prevPanel = this.idx - 1;
            if (prevPanel < 0) {
              prevPanel = this.panelCount - 1;
            }
            this.showPanel(prevPanel);
          }
          if (e.key == 'ArrowRight') {
            var nextPanel = this.idx + 1;
            if (nextPanel >= this.panelCount) {
              nextPanel = 0;
            }
            this.showPanel(nextPanel);
          }
        }.bind(this)
      );
      if (woodstream.TouchObj) {
        this.touch = new woodstream.TouchObj(this.el, this.touchHandler);
      }
    };
    setInterval(
      function () {
        var focused = this.id.is(':focus-within');
        if (this.autoplay && !focused) {
          var nextPanel = this.idx + 1;
          if (nextPanel >= this.panelCount) {
            nextPanel = 0;
          }
          this.showPanel(nextPanel);
        }
      }.bind(this),
      this.pause
    );
    this.init();
  };
  $(document).ready(function () {
    var lcSlider = new woodstream.LearningCenterSlider('pp-lc-slider');
  });
});
