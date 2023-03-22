require(['jquery'], function($) {

  woodstream.efficacySlider = function(sliderId) {
    this.sliderId = sliderId;
    this.el = $('#' + this.sliderId);
    this.width = $(this.el).innerWidth();

    this.wrap = $(this.el).find('.product-table-wrap');
    this.tables = $(this.el).find('.product-table');

    this.insectWrap = this.wrap.parent().find('.insect-wrap');
    this.insects = this.insectWrap.find('.insect');

    this.insectCount = this.insects.length;

    this.category = this.el.find('.product-header .category');
    this.headline = this.el.find('.product-header .headline');

    this.buttons = $(`.product-table-nav[data-target="${sliderId}"] button`);
    this.currentIndex = 0;
    this.maxIndex = this.insects.length - 1;

    this.buttons.on('click', function(e) {
      this.clickHandler(e);
    }.bind(this));

    this.insects.on('click', function(e) {
      this.insectHandler(e.currentTarget);
    }.bind(this));

    this.updateTitle = function(speed) {
      this.category.find('h3').animate({'opacity':0}, speed / 2, () => {
        this.category.find('h3').attr('aria-hidden','true');
        this.category.find(`h3[data-idx="${this.currentIndex}"]`).attr('aria-hidden', 'false').animate({'opacity':1}, speed / 2);
      });

      this.headline.find('h2').animate({'opacity':0}, speed / 2, () => {
        this.headline.find('h2').attr('aria-hidden','true');
        this.headline.find(`h2[data-idx="${this.currentIndex}"]`).attr('aria-hidden', 'false').animate({'opacity':1}, speed / 2);
      });
    }

    this.prevPanel = function(speed) {
      if (!this.wrap.is(':animated')) {

        if (speed == undefined) { speed = 400; }

        // update title

        if (this.currentIndex == 0) { this.currentIndex = this.category.find('h3').length; }
        this.currentIndex = (this.currentIndex - 1) % this.insectCount;
        this.updateTitle(speed);

        // slide product table

        let lastChild = this.wrap.find('.product-table:last-child');
        let lastChildClone = lastChild.clone(true,true);
        let panelWidth = lastChild.outerWidth(true);
        this.wrap.css('left',-1 * panelWidth);
        lastChild.prependTo(this.wrap);
        lastChildClone.appendTo(this.wrap);
        this.wrap.animate({'left': 0}, speed, () => {
          lastChildClone.remove();
        });

        // slide insect nav

        let insectSpeed;
        if (window.innerWidth < 768) { insectSpeed = 0; } else { insectSpeed = speed; }
        let insectLastChild = this.insectWrap.find('.insect:last-child');
        let insectPanelWidth = insectLastChild.outerWidth(true);
        let insectLastChildClone = insectLastChild.clone(true,true);
        this.insectWrap.css('left',-1 * insectPanelWidth);
        insectLastChild.prependTo(this.insectWrap);
        this.insectWrap.find('.insect').attr('aria-selected','false');
        this.insectWrap.find(`[data-idx="${this.currentIndex}"]`).attr('aria-selected','true');
        insectLastChildClone.appendTo(this.insectWrap);
        this.insectWrap.animate({'left': 0}, insectSpeed, () => {
          insectLastChildClone.remove();
        });
      }
    }

    this.nextPanel = function(speed) {
      if (!this.wrap.is(':animated')) {

        if (speed == undefined) { speed = 400; }

        // update title

        this.currentIndex = (this.currentIndex + 1) % this.insectCount;
        this.updateTitle(speed);

        // slide product table

        let firstChild = this.wrap.find('.product-table:first-child');
        let panelWidth = firstChild.outerWidth(true);
        let firstChildClone = firstChild.clone(true,true);
        firstChildClone.appendTo(this.wrap);
        this.wrap.animate({'left': -1 * panelWidth}, speed, () => {
          this.wrap.css('left', 0);
          firstChild.remove();
        });

        // slide insect nav

        let insectSpeed;
        if (window.innerWidth < 768) { insectSpeed = 0; } else { insectSpeed = speed; }
        let insectFirstChild = this.insectWrap.find('.insect:first-child');
        let insectPanelWidth = insectFirstChild.outerWidth(true);
        let insectFirstChildClone = insectFirstChild.clone(true,true);
        insectFirstChildClone.appendTo(this.insectWrap);
        this.insectWrap.find('.insect').attr('aria-selected','false');
        this.insectWrap.find(`[data-idx="${this.currentIndex}"]`).attr('aria-selected','true');
        this.insectWrap.animate({'left': -1 * insectPanelWidth}, insectSpeed, () => {
          this.insectWrap.css('left', 0);
          insectFirstChild.remove();
        });
      }
    }

    this.touchHandler = function(obj) {
      if (window.innerWidth < 768) {
        if (obj.status == 'end') {
          if (obj.xMove < - 50) { this.nextPanel(); }
          if (obj.xMove > 50) { this.prevPanel(); }
        }
      }
    }.bind(this);

    this.touch = new woodstream.TouchObj(this.sliderId, this.touchHandler);

    this.clickHandler = function(e) {
      if ($(e.target).hasClass('prev')) { this.prevPanel(); }
      if ($(e.target).hasClass('next')) { this.nextPanel(); }
    }

    this.insectHandler = function(el) {
      let idx = $(el).attr('data-idx');
      if (this.currentIndex == this.maxIndex && idx == 0) {
        this.nextPanel();
        return;
      } else if (this.currentIndex == 0 && idx == this.maxIndex) {
        this.prevPanel();
        return;
      } else if (idx < this.currentIndex) {
        this.prevPanel();
        return;
      } else if (idx > this.currentIndex) {
        this.nextPanel();
      }
    }
  }

  $(window).on('resize', function() {
    let docWidth = window.innerWidth;
    if (docWidth < 768) {
      $('.product[data-mobile-visible="false"]').attr('aria-hidden', true);
    } else {
      $('.product').attr('aria-hidden', false);
    }
  })

  $('#product-dropdown').on('change', function() {
    $('.product').attr('data-mobile-visible', false).attr('aria-hidden', true);
    $(`.${$(this).val()}`).attr('data-mobile-visible', true).attr('aria-hidden', false);
  });

  let tableSliders = $('.efficacy .product:not(.static)');
  let tableSliderCollection = [];
  tableSliders.each(function() {
    let id = $(this).attr('id');
    tableSliderCollection.push(new woodstream.efficacySlider(id));
  });

});
