require(['jquery'], function($) {

  // zoom slider controls

  woodstream.z3 = function(id) {
    this.name = id;
    this.el = $('#' + id);
    this.panels = this.el.find('.panel');
    this.panelCount = this.panels.length;
    this.currentPanel = 0;
    this.wrap = this.el.find('.panel-wrap');
    this.animating = false;
    this.touch = null;

    this.left = function() {

      // animate existing panels

      if (this.wrap.find('.active a').is(':focus')) { this.wrap.find('.left a').focus(); }

      this.wrap.find('.panel:nth-child(1)').removeClass('left').addClass('active').attr('aria-hidden',false);
      this.wrap.find('.panel:nth-child(2)').removeClass('active').addClass('right').attr('aria-hidden',false);
      if (this.zoom) {
        this.wrap.find('.panel:nth-child(1)').attr('aria-hidden',false);
        this.wrap.find('.panel:nth-child(2)').attr('aria-hidden',true);
      }

      this.wrap.find('.panel:nth-child(3)').removeClass('right').addClass('right-offscreen').one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function(event) {
        this.wrap.find('.right-offscreen').remove();
        this.animating = false;
      }.bind(this));

      // add new panel

      if (this.currentPanel === 0) { this.currentPanel = this.panelCount -1; } else { this.currentPanel --; }
      var newPanelIndex = (this.currentPanel) % this.panelCount;
      var newLeft = this.panels.eq(newPanelIndex).clone().addClass('left-new').attr('aria-hidden',true);;
      this.wrap.prepend(newLeft);
      var wait = setTimeout(function() {
        this.wrap.find('.panel:first-child').removeClass('left-new').addClass('left');
      }.bind(this), 0);

      this.updateLinks();

    }

    this.right = function() {

      // animate existing panels

      if (this.wrap.find('.active a').is(':focus')) { this.wrap.find('.right a').focus(); }

      this.wrap.find('.panel:nth-child(1)').removeClass('left').addClass('left-offscreen').one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function(event) {
        this.wrap.find('.left-offscreen').remove();
        this.animating = false;
      }.bind(this));
      this.wrap.find('.panel:nth-child(2)').removeClass('active').addClass('left').attr('aria-hidden',true);
      this.wrap.find('.panel:nth-child(3)').removeClass('right').addClass('active').attr('aria-hidden',false);

      // add new panel

      if (this.currentPanel === this.panelCount - 1) { this.currentPanel = 0; } else { this.currentPanel ++; }
      var newPanelIndex = (this.currentPanel + 2) % this.panelCount;
      var newRight = this.panels.eq(newPanelIndex).clone().addClass('right-offscreen').attr('aria-hidden',true);
      this.wrap.append(newRight);
      var wait = setTimeout(function() {
        this.wrap.find('.panel:last-child').removeClass('right-offscreen').addClass('right');
      }.bind(this), 0);
      this.updateLinks();

    }

    this.updateLinks = function() {
      this.wrap.find('.panel a').attr('tabindex',-1);
      this.wrap.find('.panel.active a').attr('tabindex',0);
    }

    this.el.find('.sc-left').on('click', function() { if (!this.animating) { this.animating = true; this.left(); } }.bind(this));
    this.el.find('.sc-right').on('click', function() { if (!this.animating) { this.animating = true; this.right(); } }.bind(this));

    this.el.on('keydown', function(e) {
      if (!this.animating) {
        this.animating = true;
        if (e.which === 37) { this.right(); }
        if (e.which === 39) { this.left(); }
      }
    }.bind(this));

    this.touchHandler = function(obj) {
      if (obj.status === 'end') {
        if (obj.xMove > 50) { this.left() }
        if (obj.xMove <  -50) { this.right() }
      }
    }.bind(this);

    this.init = function() {

      this.wrap.attr('aria-roledescription','carousel');
      this.panels.each(function() {
        $(this).attr({'aria-roledescription':'slide', 'aria-hidden':true});
        $(this).find('a').attr('tabindex',-1);
      });
      var left = this.panels.eq((this.currentPanel) % this.panelCount).clone().addClass('left');
      var active = this.panels.eq((this.currentPanel + 1) % this.panelCount).clone().addClass('active');
      var right = this.panels.eq((this.currentPanel + 2) % this.panelCount).clone().addClass('right');
      this.wrap.append(left, active, right);

      if (woodstream.TouchObj) {
        this.touch = new woodstream.TouchObj(this.name, this.touchHandler);
      }
    }.bind(this);

    this.init();
  }

  if ($('#ws-reviews').length > 0) { var hhReviews = new woodstream.z3('ws-reviews'); }
  if ($('#ask-experts-slider').length > 0) { var expertSlider = new woodstream.BlockSlider('ask-experts-slider'); }

});