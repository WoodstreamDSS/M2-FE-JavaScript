require(['jquery'], function($) {

  woodstream.stepSlider = class {
    constructor(id) {
      this.id = id;
      this.el = $(`#${this.id}`);
      this.imageWrap = this.el.find('.image-panel-wrap');
      this.copyWrap = this.el.find('.copy-panel-wrap');
      this.navWrap = this.el.find('.nav-panel-wrap');
      this.touch = new woodstream.TouchObj('steps-slider', this.sliderHandler.bind(this));
      this.controlPrev = this.el.find('.control-wrap .prev');
      this.controlNext = this.el.find('.control-wrap .next');
      this.index = 0;
      this.animating = false;
      this.controlNext.on('click', function() {
        if (!this.animating) { this.next(); }
      }.bind(this));
      this.controlPrev.on('click', function() {
        if (!this.animating) { this.prev(); }
      }.bind(this));
      this.navWrap.find('.nav-panel').on('click', function(e) { this.clickHandler(e); }.bind(this));
      this.updateAria();
    }

    sliderHandler = function(obj) {
      if (obj.status == 'end') {
        if (obj.xMove > 50 && !this.animating) { this.prev(); }
        if (obj.xMove < -50 && !this.animating) { this.next(); }
      }
    }

    updateAlignment = function() {
      $('.nav-panel-wrap').attr('data-idx', this.index);
    }

    updateAria = function() {
      this.navWrap.find('.nav-panel').attr('aria-selected', false);
      this.navWrap.find('.nav-panel:first-child').attr('aria-selected', true);

      let panels = $('.image-panel, .copy-panel, .nav-panel');

      panels.each(function() {

        let hidden = true;
        let selected = false;
        let tab = 0;

        if ($(this).index() == 0) {
          hidden = false;
          selected = true;
        }

        $(this).attr({'aria-hidden': hidden, 'aria-selected': selected});

        if (hidden) {
          tab = -1;
        }
        $(this).find('a').attr('tabindex', tab);
      });
    }

    clickHandler = function(e) {
      let idx = $(e.currentTarget).index();
      for (let i = 0; i < idx; i++) {
        this.next(0);
      }
    }

    prev = function(delay = 250) {
      this.animating = true;
      let lastImagePanel = this.imageWrap.find('.image-panel:last-child')
      let lastImagePanelClone = lastImagePanel.clone(true, true);

      let lastCopyPanel = this.copyWrap.find('.copy-panel:last-child');
      let lastCopyPanelClone = lastCopyPanel.clone(true, true);

      let lastNavPanel = this.navWrap.find('.nav-panel:last-child');
      let lastNavPanelClone = lastNavPanel.clone(true, true);

      let newMargin = this.imageWrap.innerWidth();

      this.imageWrap.prepend(lastImagePanelClone).css({'left': -1 * newMargin});
      this.copyWrap.prepend(lastCopyPanelClone).css({'left': -1 * newMargin});
      this.navWrap.prepend(lastNavPanelClone).css({'left': -1 * (newMargin / 3)});

      this.index --;
      if (this.index < 0) { this.index = 2; }
      this.updateAlignment();

      this.imageWrap.animate({'left': 0}, delay, function() {
        lastImagePanel.remove();
      });
      this.copyWrap.animate({'left': 0}, delay, function() {
        lastCopyPanel.remove();
      });
      this.navWrap.animate({'left': 0}, delay, function() {
        lastNavPanel.remove();
        this.updateAria();
        this.animating = false;
      }.bind(this));
    }

    next = function(delay = 250) {
      this.animating = true;
      $('.nav-panel').attr('aria-selected', false);

      let firstImagePanel = this.imageWrap.find('.image-panel:first-child')
      let firstImagePanelClone = firstImagePanel.clone(true, true);

      let firstCopyPanel = this.copyWrap.find('.copy-panel:first-child');
      let firstCopyPanelClone = firstCopyPanel.clone(true, true);

      let firstNavPanel = this.navWrap.find('.nav-panel:first-child');
      let firstNavPanelClone = firstNavPanel.clone(true, true);

      let newMargin = this.imageWrap.innerWidth();

      this.imageWrap.append(firstImagePanelClone);
      this.copyWrap.append(firstCopyPanelClone);
      this.navWrap.append(firstNavPanelClone);

      this.index ++
      if (this.index > 2) { this.index = 0; }
      this.updateAlignment();

      this.imageWrap.animate({'left': -newMargin}, delay, function() {
        firstImagePanel.remove();
        this.imageWrap.css({'left':0});
      }.bind(this));
      this.copyWrap.animate({'left': -newMargin}, delay, function() {
        firstCopyPanel.remove();
        this.copyWrap.css({'left':0});
      }.bind(this));
      this.navWrap.animate({'left': -1 * (newMargin / 3)}, delay, function() {
        firstNavPanel.remove();
        this.navWrap.css({'left':0});
        this.updateAria();
        this.animating = false;
      }.bind(this));
    }
  }

  let stepSlider = new woodstream.stepSlider('steps-slider');

});