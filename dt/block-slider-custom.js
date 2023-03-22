woodstream.BlockSliderCustom = function(id) {

  this.id = id;
  this.el = $(`#${this.id}`);
  this.touch = null;
  this.el.on('keydown', (e) => { this.keyHandler(e); });
  this.breakpoint = parseInt(this.el.attr('data-breakpoint'));
  this.circles = (this.el.attr('data-circles') === 'true');
  this.navCircles = null;
  this.current = 0;
  this.wrap = $(`#${id} .panel-wrap`);
  this.panels = $(`#${id} .panel`);
  this.panelCount = this.panels.length;
  this.panelWidth = null;
  this.visible = null;
  this.swipe = null;

  $(window).on('resize', () => { this.resizeHandler(); });

  this.keyHandler = function(e) {
    console.log(e.keyCode);
  }

  this.touchHandler = function(obj) {
    if (obj.status == 'end') {
      if (obj.xMove > 30) { this.previous(); }
      if (obj.xMove < -30) { this.next(); }
    }
  }.bind(this);

  this.updateAria = function() {
    console.log('updateAria');
  }

  this.circleHandler = function(e) {
    console.log(e);
  }

  this.next = function(delay = 500) {
    if (!this.wrap.is(':animated') && this.swipe) {
      let firstChild = $('#' + this.id + ' .panel-wrap .panel:first-child');
      let firstChildClone = firstChild.clone(true, true);
      firstChildClone.appendTo(this.wrap);
      this.wrap.animate({'left': -1 * this.panelWidth}, delay, () => {
        firstChild.remove();
        this.wrap.css('left', 0);
        this.current = (this.current + 1) % this.panelCount;
        this.updateAria();
      });
    }
  }.bind(this);

  this.previous = function(delay = 500) {
    if (!this.wrap.is(':animated') && this.swipe) {
      let lastChild = $('#' + this.id + ' .panel-wrap .panel:last-child');
      let lastChildClone = lastChild.clone(true, true);
      this.wrap.css({'left': -1 * this.panelWidth}).prepend(lastChildClone);
      this.wrap.animate({'left': 0}, delay, () => {
        lastChild.remove();
        this.current --;
        if (this.current < 0) { this.current = this.panelCount - 1; }
        this.updateAria();
      });
    }
  }.bind(this);

  this.renderCircles = function() {
    let circleHTML = document.createElement('div');
    $(circleHTML).attr({'id':`${this.id}-nav-circles`,'role':'tablist','class':'nav-circles'});
    for (let i = 0; i < this.panelCount; i++) {
      let circle = document.createElement('button');
      $(circle).attr({'role':'tab','class':'nav-circle','aria-selected':'false','aria-controls':`${this.id}-panel-${i}`});
      if (i == 0) { $(circle).attr('aria-selected', 'true'); }
      $(circleHTML).append(circle);
    }
    this.el.append(circleHTML);
    this.navCircles = $(`#${this.id}-nav-circles`);
    this.navCircles.on('click', (e) => { this.circleHandler(e); });
  }

  this.resizeHandler = function() {
    this.panelWidth = this.panels.outerWidth();
    this.visible = Math.floor(this.wrap.innerWidth() / this.panelWidth);
    if (this.visible < this.panelCount) {
      this.navCircles.show();
      this.swipe = true;
    } else {
      this.navCircles.hide();
      this.swipe = false;
    }
    this.updateAria();
  }

  this.touchHandler = () => {
    console.log(obj.status);
    console.log(this);
  }

  this.init = function() {
    this.el.attr({'aria-roledescription':'tablist'});
    this.panels.attr({'role':'group','role':'tab'});
    for (let i = 0; i < this.panelCount; i++) {
      this.panels.eq(i).attr({'id':`${this.id}-panel-${i}`});
      if (i === 0) {
        this.panels.eq(i).attr({'aria-selected':'true'});
      }
    }
    this.panelWidth = this.panels.outerWidth();
    this.visible = Math.floor(this.wrap.innerWidth() / this.panelWidth);
    this.updateAria();

    if (this.circles) {
      this.renderCircles();
    }

    if (woodstream.TouchObj) {
      this.touch = new woodstream.TouchObj(this.id, this.touchHandler);
    }

    this.resizeHandler();

  }

  this.init();

}

let blockSliderCollection = [];
let blockSliders = $('.block-slider-custom');
blockSliders.each(function() {
  blockSliderCollection.push(new woodstream.BlockSliderCustom($(this).attr('id')));
});
console.log(blockSliderCollection);