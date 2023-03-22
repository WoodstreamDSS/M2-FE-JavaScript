require(['jquery'], function($) {

  woodstream.ExpandTip = function(el, idx) {
    this.el = $(el);
    this.idx = idx;
    this.open = false;
    this.copy = this.el.find('.tip-copy');
    this.toggleButton = null;

    this.toggle = function() {
      if (!this.open) {
        this.copy.attr('data-open', true);
        this.toggleButton.remove();
      }
      this.open = !this.open;
    }

    let toggleLink = document.createElement('button');
    $(toggleLink).attr('id', 'toggle-' + this.idx).addClass('read-more-link').html('Read More&nbsp;&raquo;');

    this.el.find('.tip-copy').append(toggleLink);
    this.toggleButton = $(this.el).find('.read-more-link');
    this.toggleButton.on('click', () => this.toggle());

  }

  let tips = $('.mouse-tip');
  let tipCollection = [];

  if (tips.length > 0) {
    tips.each(function(i){
      tipCollection.push(new woodstream.ExpandTip($(this), i));
    });
  }

});