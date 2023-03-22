woodstream.SimpleTabsMultiple = function(el) {
  this.el = $(el);
  this.panels = this.el.find('.panel');
  this.panelCount = this.panels.length;
  this.nav = this.el.find('nav');
  this.navButtons = this.nav.find('button');
  this.mobileButtons = null;
  var breakpoint = parseInt(this.el.attr('data-breakpoint'));
  this.breakpoint = 0;
  this.activeTab = 0;
  this.accordion = false;
  this.forceOpen = false;
  this.initialized = false;

  if (this.el.attr('data-accordion-force-open') == "true") { this.forceOpen = true; }

  if (!isNaN(breakpoint)) { this.breakpoint = breakpoint; }

  this.init = function() {
    this.nav.attr('role','tablist');

    // check state of tabs, accordion mode below breakpoint

    var docWidth = window.innerWidth;
    this.accordion = docWidth <= this.breakpoint;

    // check that number of buttons and panels correlates

    if (this.navButtons.length !== this.panelCount) {
      console.error('SimpleTabs: Number of Buttons and Panels must be the same.');
    }

    // update aria tags and classes

    var bindMobEvent = false;
    this.sectionId = '';
    for (var i = 0; i < this.panelCount; i++) {

      // section id
      this.sectionId= this.el.attr('id') != null ? this.el.attr('id') + '-' : '';

      this.panels.eq(i).attr({'role':'tabpanel','id':this.sectionId +'panel-'+i});

      // add attributes to navButtons

      this.navButtons.eq(i).attr({'role':'tab','aria-controls':this.sectionId + 'panel-'+i,'data-index':i});

      // first tab is alwyas active and visible

      if (i == 0) {
        var ariaState = false;
        this.navButtons.eq(i).addClass('active');
      } else {
        var ariaState = true;
      }

      this.panels.eq(i).attr('aria-hidden', ariaState);
      // create mobile button
      if(this.el.find('button.mobileTab[aria-controls="'+(this.sectionId + 'panel-' + i)+'"]').length == 0){
        bindMobEvent = true;
        var mobileButton = $(document.createElement('button'));
        mobileButton.addClass('mobileTab').attr({'aria-controls':this.sectionId + 'panel-' + i, 'role':'tab','aria-hidden':false, 'data-index':i});
        mobileButton.addClass('active');
        //if (i == 0) { mobileButton.addClass('active'); }
        mobileButton.text(this.navButtons.eq(i).text());
        mobileButton.insertBefore(this.panels.eq(i));
      }
    }

    this.mobileButtons = this.el.find('.mobileTab');
    this.navButtons.on('click', function(e) {
      this.clickHandler($(e.target));
    }.bind(this));
    if(bindMobEvent){
      this.mobileButtons.on('click', function(e) {
        this.clickHandler($(e.target));
      }.bind(this));
    }

    this.panels.each(function() {
      if (!$(this).attr('data-accordion-open') == 'true') {
        $(this).attr('aria-hidden', false);
      } else {
        $(this).attr('aria-hidden', true);
      }
    });

    if (this.accordion) {
      for (var j = 0; j < this.panels.length; j++) {
        var currentPanel = this.panels.eq(j);
        if (j == 0 && currentPanel.attr('data-accordion-open') != 'false') {
          this.mobileButtons.eq(j).trigger('click');
        } else if (currentPanel.attr('data-accordion-open') == 'true') {
          this.mobileButtons.eq(j).trigger('click');
        }
      }
    }

    this.resizeHandler();
    this.initialized = true;
  }


  this.clickHandler = function(button) {
    var index = parseInt(button.attr('data-index'));
    this.activeTab = index;
    var target = $('#' + button.attr('aria-controls'));
    this.panels = target.parents('.ws-simple-tabs-multiple').find('.panel');
    this.navButtons = target.parents('.ws-simple-tabs-multiple').find('nav button');
    this.mobileButtons = target.parents('.ws-simple-tabs-multiple').find('button.mobileTab');

    if (this.accordion) {
      if (target.hasClass('active')) {
        target.attr('aria-hidden', true).removeClass('active open');
      } else {
        // this.panels.attr('aria-hidden', true).removeClass('active');
        target.attr('aria-hidden', false).addClass('active open');
        if (this.initialized) {
          //$('html,body').animate({scrollTop: target[0].offsetTop});
        }
      }
      $.each(this.mobileButtons, function(i,e){
          if($('#' + $(e).attr('aria-controls')).attr('aria-hidden') == 'false'){
            $(e).addClass('active');
          } else{
            $(e).removeClass('active');
          }
      });
    } else {
      this.panels.attr('aria-hidden', true);
      target.attr('aria-hidden', false);
    }
    this.navButtons.removeClass('active');
    this.navButtons.eq(index).addClass('active');
  };

  $(this.el).on('keydown', function(e) {
    if (e.which == 37) { this.activeTab --; }
    if (e.which == 39) { this.activeTab ++; }
    if (this.activeTab < 0) { this.activeTab = this.panelCount - 1; }
    if (this.activeTab >= this.panelCount) { this.activeTab = 0; }
    if (e.which == 13 && $(e.target).hasClass('mobileTab')) {
      this.navButtons.eq(this.activeTab).trigger('click');
    }
  }.bind(this));

  this.resizeHandler = function() {
    var docWidth = window.innerWidth;
    if (docWidth < this.breakpoint) {
      this.accordion = true;
      this.navButtons.attr('aria-hidden',true);
      this.mobileButtons.attr('aria-hidden',false);
    } else {
      this.accordion = false;
      this.navButtons.attr('aria-hidden',false);
      this.mobileButtons.attr('aria-hidden',true);
    }
    this.checkPanelState();
  };

  this.checkPanelState = function() {
    if (!this.accordion) {
      this.panels.removeClass('open active');
      this.navButtons.eq(this.activeTab).trigger('click');
    } else if (this.accordion && this.forceOpen == true) {
      this.panels.addClass('open').attr('aria-hidden',false);
    }
  }

  $(window).resize(woodstream.Debounce(this.resizeHandler, 250).bind(this));
  this.el.addClass('ws-simple-tabs');
  this.init();
  if(window.innerWidth <= this.breakpoint){
    $.each($('.ws-simple-tabs-multiple').find('button.mobileTab'), function(i,e){
      if($(e).hasClass('active'))
        $(e).click();
    });
  }
}

var tabSelection = $('.ws-simple-tabs-multiple');
if (tabSelection.length > 0) {
  var tabCollection = [];
  tabSelection.each(function() {
    tabCollection.push(new woodstream.SimpleTabsMultiple(this));
  });
}

$(document).ready(function() {
  var hash = window.location.hash;
  var hashSplit = hash.split('#',3);
  hashSplit.shift();
  $('#' + hashSplit[0]).trigger('click');
  hashSplit.shift();
  if (hashSplit.length > 0) {
    var el = document.getElementById(hashSplit[0]);
    setTimeout(function() {
      el.scrollIntoView();
    }, 500);
  }
});

//------DynaTrap, DynaZap, Dynashield tabs-----
const fnSwitchTab = function(t) {
  var tabIdx = t.getAttribute('data-tabidx');
  $('.tab.inline-item[aria-hidden=false]').attr('aria-hidden', true);
  $('.tab-content[aria-hidden=false]').attr('aria-hidden', true);
  $('.tab.inline-item[data-tabidx="' + tabIdx + '"]').attr('aria-hidden', false);
  $('.tab-content')[parseInt(tabIdx)].setAttribute('aria-hidden', false);
}

$(document).ready(function() {
  $('.tab.inline-item').on('click', function() { fnSwitchTab(this); });
  $('.tab.inline-item').on('keyup', function(e) {
    if (e.which == 13 || e.which == 32) { fnSwitchTab(this); }
  });

});