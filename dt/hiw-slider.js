woodstream.howItWorksSlider = function(id) {
  this.id = id;
  this.el = $(`#${this.id}`);

  this.panels = this.el.find('.panel');
  this.wrap = this.el.find('.panel-wrap');

  this.panelCount = this.panels.length;
  this.panelWidth = null;
  this.swipe = null;

  this.circles = null;
  this.navCircles = null;
  this.currentPanel = 0;

  this.breakpoint = 480;

  this.touchHandler = (obj) => {
    let newPanel;
    if (obj.status == 'end' && this.swipe) {
      if (obj.xMove > 30) {
        newPanel = this.currentPanel - 1;
        if (newPanel < 0) {
          newPanel = 0;
        }
      } else if (obj.xMove <= -30) {
        newPanel = this.currentPanel + 1;
        if (newPanel > this.panelCount - 1) {
          newPanel = this.panelCount - 1;
        }
      }
      this.updatePanelPosition(newPanel);
    };
  }

  this.resizeHandler = () => {
    this.panelWidth = this.panels.outerWidth();
    let docWidth = window.innerWidth;
    if (docWidth < this.breakpoint) {
      this.swipe = true;
      this.navCircles.attr({'aria-hidden': 'false'});
      this.updatePanelPosition();
    } else {
      this.swipe = false;
      this.navCircles.attr({'aria-hidden': 'true'});
    }
    this.updatePanelPosition();
    setTimeout(() => { this.wrap.removeClass('quick'); }, 250);
  }

  this.renderCircles = () =>{
    let circleHTML = document.createElement('div');
    $(circleHTML).attr({'id':`${this.id}-nav-circles`,'role':'tablist','class':'nav-circles'});
    for (let i = 0; i < this.panelCount; i++) {
      let circle = document.createElement('button');
      $(circle).attr({'role':'tab','class':'nav-circle','aria-selected':'false','aria-controls':`${this.id}-panel-${i}`,'data-index':`${i}`});
      if (i == 0) { $(circle).attr('aria-selected', 'true'); }
      $(circleHTML).append(circle);
    }
    this.el.append(circleHTML);
    this.navCircles = $(`#${this.id}-nav-circles`);
    this.navCircles.on('click', (e) => { this.circleClickHandler(e); });
    this.navCircles.on('keydown', (e) => { this.circleKeyHandler(e); });
  }

  this.updateAria = () => {
    this.navCircles.find('button').attr('aria-selected', 'false');
    this.navCircles.find(`button[data-index="${this.currentPanel}"]`).attr('aria-selected', 'true');
    if (this.swipe) {
      this.panels.attr({'aria-hidden': 'true'});
      this.panels.eq(this.currentPanel).attr({'aria-hidden': 'false'});
      this.wrap.attr('data-active-panel', this.currentPanel);
    } else {
      this.panels.attr({'aria-hidden': 'false'});
    }
  }

  this.updatePanelPosition = (targetIndex) => {
    if (this.swipe) {
      if (targetIndex == undefined) { targetIndex = this.currentPanel; }
      this.currentPanel = targetIndex;
      let newLeft = -1 * ((this.panelWidth / 2) + (this.panelWidth * this.currentPanel));
      this.wrap.css('left', newLeft);
    } else {
      this.wrap.css('left', 0);
    }
    this.updateAria();
  }

  this.circleClickHandler = (e) => {
    let target = $(e.target);
    let newIndex = target.attr('data-index');
    this.updatePanelPosition(newIndex);
  }

  this.circleKeyHandler = (e) => {
    let newIndex = this.currentPanel;
    if (e.keyCode == 37) { newIndex--; }
    if (e.keyCode == 39) { newIndex++; }
    if (newIndex > this.panelCount - 1) { newIndex = this.panelCount - 1; }
    if (newIndex < 0) { newIndex = 0; }
    this.updatePanelPosition(newIndex);
  }

  this.init = () => {
    this.renderCircles();
    this.wrap.attr({'aria-roledescription':'tablist'});
    this.panels.attr({'role':'group','role':'tabpanel'});
    for (let i = 0; i < this.panelCount; i++) {
      this.panels.eq(i).attr({'id':`${this.id}-panel-${i}`, 'aria-hidden':false});
    }
    this.panelWidth = this.panels.outerWidth();
    this.resizeHandler();
  }

  if (woodstream.TouchObj) {
    this.touch = new woodstream.TouchObj(this.id, this.touchHandler);
  }

  $(window).on('resize', () => {
    this.wrap.addClass('quick');
    this.resizeHandler();
  });

  this.init();

}

let blockSliderCollection = [];
let blockSliders = $('.hiw-slider');
blockSliders.each(function() {
  blockSliderCollection.push(new woodstream.howItWorksSlider($(this).attr('id')));
});