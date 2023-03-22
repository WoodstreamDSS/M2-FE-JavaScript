require(['jquery'], function($) {
/*
  woodstream.PhotoSelector = function(el) {
    this.el = $(el);
    this.thumbs = this.el.find('.wsps-thumbs img');
    this.target = this.el.find('.wsps-main img');
    this.caption = this.el.find('.wsps-caption span');

    this.thumbs.attr('tabindex',0);

    this.clickHandler = function(el) {
      this.thumbs.attr('aria-selected', false).attr('tabindex',0);
      el.attr('aria-selected', true);
      var imgSrc = el.attr('data-large');
      var imgCaption = el.attr('data-caption');
      if (imgCaption == undefined) { imgCaption = ''; }
      var imgAlt = el.attr('alt');
      this.target.attr('src', imgSrc).attr('alt', imgAlt);
      this.caption.text(imgCaption);
    }

    this.init = function() {
      this.thumbs.attr('aria-selected', false);
      var firstEl = this.thumbs.first();
      this.clickHandler(firstEl);
    }

    this.thumbs.on('click', function(e) {
      var clickEl = $(e.target);
      this.clickHandler(clickEl);
    }.bind(this));

    this.thumbs.on('keydown', function(e) {
      if (e.which === 13 || e.which === 32) {
        e.preventDefault();
        var clickEl = $(e.target);
        this.clickHandler(clickEl);
      }
    }.bind(this));

    this.init();
  }

  var photoSelectors = $('.ws-photo-selector');
  if (photoSelectors.length > 0) {
    var photoSelectorCollection = [];
    photoSelectors.each(function() {
      photoSelectorCollection.push(new woodstream.PhotoSelector(this));
    });
  }
*/
});