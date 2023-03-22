

require(['jquery'], function($) {

  woodstream.ReviewSlider = class {
    constructor(id, breakpoint = 767) {
      this.id = id;
      this.breakpoint = breakpoint;
      this.el = $(`#${this.id}`);
      this.wrap = this.el.find('.review-wrap');
      this.reviews = function() { return this.wrap.find('.review'); }
      this.buttons = this.el.find('.review-controls button');
      this.count = this.reviews().length;
      this.touch = new woodstream.TouchObj(this.id, this.touchHandler.bind(this));
      this.itemWidth = 0;
      this.buttons.on('click', (e) => this.buttonHandler(e));
      this.reviewNav = this.el.find('.review-nav');
      this.circles = null;
      this.idx = 1; // 0 will be leftmost review, active review is always the center review
      this.mobile = false;
      this.autoPlay = true;
      this.paused = false;
      this.focus = false;
      this.hover = false;
      this.interval = 7000;

      $(window).on('resize', () => { this.resizeHandler(); });
      this.el.on('keyup', (e) => { this.keyHandler(e); })

      if (this.autoPlay) {
        $(this.el).hover(() => {
          this.hover = true;
        }, () => {
          this.hover = false;
        });
      }

      this.init();
    }

    prev(speed = 250) {
      if (!this.wrap.is(':animated')) {
        let lastItem = $(this.wrap).find('.review:last-child');
        let lastItemClone = lastItem.clone(true);
        this.wrap.css({'left':-1 * this.itemWidth});
        this.wrap.prepend(lastItemClone);
        this.wrap.animate({'left':0}, speed, () => {
          lastItem.remove();
          this.idx--;
          this.updateAria();
        });
      }
    }

    next(speed = 250) {
      if (!this.wrap.is(':animated')) {
        let firstItem = $(this.wrap).find('.review:first-child');
        let firstItemClone = firstItem.clone(true);
        this.wrap.append(firstItemClone);
        this.wrap.animate({'left':-1 * this.itemWidth}, speed, () => {
          firstItem.remove();
          this.wrap.css({'left':0});
          this.idx++;
          this.updateAria();
        });
      }
    }

    updateAria() {
      this.mobile ? this.buttons.attr('aria-hidden', true) : this.buttons.attr('aria-hidden', false);

      if (this.idx < 0) { this.idx = this.reviews().length - 1; }
      if (this.idx > this.reviews().length - 1) { this.idx = 0; }
      this.reviews().attr('aria-selected', false);
      this.wrap.find(`.review[data-idx="${this.idx}"]`).attr('aria-selected', true);

      this.circles.each((i) => {
        let state = false;
        if (i == this.idx) { state = true; }
        this.circles.eq(i).attr('aria-selected', state);
      });

      this.reviews().attr('aria-hidden', true).find('a').attr('tabindex', -1);
      this.reviews().eq(1).attr('aria-hidden', false).find('a').attr('tabindex', 0);
    }

    buttonHandler(e) {
      let button = $(e.currentTarget);
      if (button.hasClass('prev')) { this.prev(); }
      if (button.hasClass('next')) { this.next(); }
    }

    touchHandler(obj) {
      if (this.mobile) {
        if (obj.status == 'end') {
          if (obj.xMove < -50) { this.next(); }
          if (obj.xMove > 50) { this.prev(); }
        }
      }
    }

    circleHandler(circle) {
      let newIndex = $(circle).attr('data-idx');
      while (this.idx != newIndex) {
        this.next(0);
      }
    }

    checkFocus() {
      const focusEl = $(document.activeElement);
      if (this.el.find(focusEl).length == 1) {
        this.focus = true;
      } else {
        this.focus = false;
      }
    }

    autoPlayHandler() {
      this.checkFocus();
      if (this.focus || this.hover) { this.paused = true; } else { this.paused = false; }
      let timer = setTimeout(() => {
        if (!this.paused) {
          this.next();
        }
        this.autoPlayHandler();
      }, this.interval)
    }

    keyHandler(e) {
      if (e.which == 37) { this.prev(); }
      if (e.which == 39) { this.next(); }
    }

    resizeHandler() {
      this.mobile = window.innerWidth < this.breakpoint;
      this.itemWidth = this.reviews().eq(0).innerWidth();
      this.updateAria();
    }

    init() {
      this.mobile = window.innerWidth < this.breakpoint;
      this.itemWidth = this.reviews().eq(0).innerWidth();
      this.reviews().each(function(i) {
        let state = false;
        if (i == 1) { state = true; }
        $(this).attr({
          'data-idx':i,
          'aria-selected': state
        });
      });

      let circleWrap = document.createElement('div');
      $(circleWrap).addClass('circle-wrap').attr('role', 'tablist');
      for (let i = 0; i < this.reviews().length; i++) {
        let state = false;
        $(`.review[data-idx="${i}"]`).attr('id', `review-${i}`);
        if (i == 1) { state = true; }
        let navCircle = document.createElement('button');
        $(navCircle).addClass('nav-circle').attr({
          'role':'tab',
          'data-idx':i,
          'aria-selected':state,
          'aria-controls': `review-${i}`,
          'aria-label': `review-${i}`
        });
        $(circleWrap).append(navCircle);
      }
      this.reviewNav.append(circleWrap);
      this.circles = this.reviewNav.find('.nav-circle');
      this.circles.on('click', (e) => { this.circleHandler(e.currentTarget); });

      this.updateAria();

      if (this.autoPlay) { this.autoPlayHandler(); }
    }

  }

  const reviewSlider = new woodstream.ReviewSlider('review-slider');

});