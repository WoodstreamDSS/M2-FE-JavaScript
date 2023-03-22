require(['jquery'], function($) {

  // tab controls

  var swapTab = function(el) {
    var idx = parseInt($(el).attr('data-idx'));
    for (var i = 0; i < blockSliders.length; i++) {
      if (i !== idx) { blockSliders[i].hide(); } else { blockSliders[i].show(); }
    }

    $('.home-tabs .home-tab-navigation ul li').removeClass('active');
    $(el).addClass('active');
    var showSlider = $('.home-tabs .home-tab-navigation ul li.active').attr('data-slider');

    var targetPanel = '#' + $(el).attr('aria-controls');
    $('.home-tabs .tab-panel').attr('aria-hidden',true);
    $(targetPanel).attr('aria-hidden',false);
    $('.home-tabs .tab-panel').find('a.cta').attr('tabindex',-1);
    $(targetPanel).find('a.cta').attr('tabindex',0);
  }

  $('.home-tabs .home-tab-navigation ul li').on('click', function() {
    swapTab(this);
  });

  $('.home-tabs .home-tab-navigation ul li').on('keyup', function(e) {
    if (e.which == 13 || e.which == 32) { swapTab(this); }
  });

  $('.home-tabs .home-tab-navigation ul li').on('click', function() { swapTab(this); });
  $('.home-tabs .home-tab-navigation ul li').on('keyup', function(e) { if (e.which === 13) { swapTab(this); } });

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

  // initialize sliders

  var blockSliders = [];

  $(document).ready(function() {
    if ($('#ws-reviews').length > 0) { var hhReviews = new woodstream.z3('ws-reviews'); }
    if ($('#ask-experts-slider').length > 0) { var expertSlider = new woodstream.BlockSlider('ask-experts-slider'); }

    blockSliders.push(new woodstream.BlockSlider('article-slider'));
    blockSliders.push(new woodstream.BlockSlider('how-to-slider'));
    blockSliders[1].hide();

    // will have to move initialization of ig slider here, put it into the blockSliders array.

    var igWrap = $('#instagram-content')[0]; // the element we're going to watch
    var options = { childList: true }; // we want the mutation observer to watch for child nodes

    var activateSlider = function() { // Create a block slider for the IG feed
      blockSliders.push(new woodstream.BlockSlider('instagram-slider')); // Create an instance of the BlockSlider, for the Instagram feed
      blockSliders[2].hide();
      observer.disconnect(); // Disconnect the mutation observer, now that its job is done
    }

    var observer = new MutationObserver(igWatch); // create a new instance of the MutationObserver, point it at the recWatch function when it pops

    var activate = woodstream.Debounce(activateSlider, 100); // Debounce the activateSlider function, with a 100ms delay

    function igWatch(mutations) { // function that's run when the MutationObserver detects a change in the panel-wrap element

    for (var mutation of mutations) { // loop through the mutations ...
        if (mutation.type === 'childList') { // if it finds an addition of child elements ...
          activate(); // ... try to activate the slider.
        }
      }

    }

    observer.observe(igWrap, options); // start the MutationObserver

  });

});