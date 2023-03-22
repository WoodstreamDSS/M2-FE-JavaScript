require(['jquery'], function($) {

  const updateTabs = function(target) {
    $('.hiw-sliders .hiw-slider').attr('aria-hidden', true);
    $(`.hiw-sliders #${target}`).attr('aria-hidden', false);
    //$(window).trigger('resize');
  }

  $('button.tab-control').on('click', function() {
    $('button.panel').attr('aria-selected', false);
    $(this).attr('aria-selected', true);

    let target = $(this).attr('aria-controls');

    $('button.tab-control').attr('aria-selected', false);
    $('button.tab-control[aria-controls="' + target + '"]').attr('aria-selected', true);
    updateTabs(target);
  });

  let selectStart = 0;
  let selectIndicator = 0;
  let xLimit;
  let barWidth, indicatorWidth;

  const updateBar = function() {
    let left = parseInt($('#selector-slider .slider-wrap').css('left'));
    let boxRatio = 100 - ((barWidth/indicatorWidth) * 100);
    let percent = (left / xLimit) * boxRatio;
    $('#selector-indicator .indicator-bar').css('left', percent + '%');
  }

  $('#selector-slider').on('keydown', function(e) {
    let targetIndex = $(e.target).index();
    if (e.keyCode == 37) {
      targetIndex--
      if (targetIndex < 0) { targetIndex = 0;}
      $(`#selector-slider .tab-control:eq(${targetIndex})`).trigger('click').get(0).focus();
    }
    if (e.keyCode == 39) {
      targetIndex++;
      if (targetIndex > 3) { targetIndex = 3;}
      $(`#selector-slider .tab-control:eq(${targetIndex})`).trigger('click').get(0).focus();
    }
  });

  const selectTouchHandler = function(obj) {
    if (window.innerWidth < 480) {
      if (obj.status == 'start') {
        selectStart = parseInt($('#selector-slider .slider-wrap').css('left'));
      }
      if (obj.status == 'move') {
        let newLeft = selectStart + obj.xMove;
        if (newLeft > 0) { newLeft = 0; }
        if (newLeft < xLimit) { newLeft = xLimit; }
        $('#selector-slider .slider-wrap').css('left', newLeft);
        updateBar();
      }
    }
  }

  const selectIndicatorTouchHandler = function(obj) {
    if (window.innerWidth < 480) {
      if (obj.status == 'start') {
        selectStart = parseInt($('#selector-slider .slider-wrap').css('left'));
      }
      if (obj.status == 'move') {
        let newLeft = selectStart - obj.xMove;
        if (newLeft > 0) { newLeft = 0; }
        if (newLeft < xLimit) { newLeft = xLimit; }
        $('#selector-slider .slider-wrap').css('left', newLeft);
        updateBar();
      }
    }
  }

  const selectTouch = new woodstream.TouchObj('selector-slider', selectTouchHandler);
  const barTouch = new woodstream.TouchObj('selector-indicator', selectIndicatorTouchHandler);

  const setLimit = function() {
    let wrapWidth = $('#selector-slider .slider-wrap').innerWidth();
    let docWidth = window.innerWidth;
    xLimit = docWidth - wrapWidth;
    if (xLimit > 0) { xLimit = 0; }
  }

  const setIndicator = function() {

    let wrapWidth = $('#selector-slider .slider-wrap').innerWidth();
    let docWidth = window.innerWidth;
    let newBarWidth = (100 * (docWidth / wrapWidth)) + '%';
    $('#selector-indicator .indicator-bar').css('width', newBarWidth);

    barWidth = $('#selector-indicator .indicator-bar').innerWidth();
    indicatorWidth = $('#selector-indicator').innerWidth();
  }

  const checkSlider = function() {
    let left = parseInt($('#selector-slider .slider-wrap').css('left'));
    if (left < xLimit) {
      $('#selector-slider .slider-wrap').css('left', xLimit);
      selectStart = xLimit;
      updateBar();
    }
  }

  $(window).on('resize', function() {
    setLimit();
    setIndicator();
    checkSlider();
    updateBar();
  });

  setLimit();
  setIndicator();

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

});