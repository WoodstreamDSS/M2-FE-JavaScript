require(['jquery'], function($) {

  // active bird control

  var birdHandler = function(target) {
    var bird = target.attr('data-bird');
    console.log(bird);

    // update background image and map, smooth transition to prevent flashing

    var currentActive = $('.mm-map-container .bird-bg-img.active');
    currentActive.css('z-index',2).removeClass('active').attr('aria-hidden',true);
    $('.mm-map-container .bird-bg-img.' + bird)
    .attr('aria-hidden', false)
    .addClass('active')
    .css({'opacity':0, 'z-index':3})
    .animate({'opacity':1}, 500, function() {
      currentActive.css('z-index',1);
    });

    // update map image, also smooth transition to prevent flashing

    var currentMap = $('.mm-map-container .map-img[aria-hidden="false"]');
    currentMap.attr('aria-hidden', true).css('z-index',2);
    $('.mm-map-container .map-img.' + bird).css('z-index',3).attr('aria-hidden',false).animate({'opacity':1}, 125, function() {
      currentMap.animate({'opacity':0}, 125);
    });

    // update nav classes

    $('.map-nav-wrap .nav-item').attr('aria-selected', false);
    target.attr('aria-selected', true);

    // update block with text and sliders

    $('.bird-info').attr('aria-hidden','true');
    $('.bird-info.' + bird).attr('aria-hidden','false');
    updateArticlesSlider(bird);

  }

  $('.map-nav-wrap .nav-item').on('click', function(e) {
    e.stopPropagation();
    if ($(this).attr('aria-selected') != 'true') {
      birdHandler($(this));
    }
  });

  $('.map-nav-wrap .nav-item').on('keydown', function(e) { if (e.which == 13) { birdHandler($(this)); } });

  // resize handler

  var desktopMode, navItems;
  var birdNav = $('.map-nav-wrap');

  var updateAria = function() {
    birdNav.find('.nav-item').attr({'aria-hidden':true,'tabindex':-1});
    birdNav.find('.nav-item:nth-child(-n+' + navItems +')').attr({'aria-hidden':false,'tabindex':0});
    $('.map-nav-wrap .nav-control.prev').focus();
  }

  var resizeHandler = function() {
    var docWidth = window.innerWidth;
    if (docWidth < 768) {
      desktopMode = false;
      navItems = 3;
      //if (docWidth > 379) { navItems = 3; }
      if (docWidth > 479) { navItems = 4; }
      if (docWidth > 579) { navItems = 5; }
     } else {
       desktopMode = true;
       navItems = 3;
     }
     updateAria();
  }

  resizeHandler();

  $(window).resize(woodstream.Debounce(resizeHandler, 250));

  // navigation scrolling

  $('.nav-control').on('click', function(e) {
    e.stopPropagation();
    $(this).hasClass('prev') ? prevBirds() : nextBirds();
  });

  var touchHandler = function(obj) {
    var mobile = window.innerWidth < 768;
    if (obj.status == "end" && mobile) {
      if (obj.xMove < -50) { nextBirds(); }
      if (obj.xMove > 50)  { prevBirds(); }
    }
  }

  var birdNavTouchListener = new woodstream.TouchObj('bird-navigation', touchHandler);

  $('.nav-control, .map-nav-wrap .nav-item').on('keydown', function(e) {
    switch(e.which) {
      case 37: prevBirds();
        break;
      case 38: prevBirds();
        break;
      case 39: nextBirds();
        break;
      case 40: nextBirds();
        break;
    }
  });

  var nextBirds = function() {
    var birds = $('.map-nav-wrap .nav-item:nth-child(-n+' + navItems + ')').clone(true);
    birds.appendTo(birdNav);
    if (desktopMode && !$(birdNav).is(':animated')) {
      var height = parseInt($('.map-nav-wrap .nav-item').innerHeight());
      var vOffset = -1 * (navItems * height);
      birdNav.animate({'top':vOffset}, 750, function() {
        $('.map-nav-wrap .nav-item:nth-child(-n+' + navItems + ')').remove();
        birdNav.css({'top':0});
        updateAria();
      });
    }
    if (!desktopMode && !$(birdNav).is(':animated')) {
      var width = parseInt($('.map-nav-wrap .nav-item').innerWidth());
      var hOffset = -1 * (navItems * width);
      birdNav.animate({'left':hOffset}, 750, function() {
        $('.map-nav-wrap .nav-item:nth-child(-n+' + navItems + ')').remove();
        birdNav.css({'left':0});
        updateAria();
      });
    }
  }

  var prevBirds = function() {
    var birds = $('.map-nav-wrap .nav-item:nth-last-child(-n+' + navItems + ')').clone(true);
    if (desktopMode && !$(birdNav).is(':animated')) {
      var height = parseInt($('.map-nav-wrap .nav-item').innerHeight());
      var vOffset = -1 * (navItems * height);
      birdNav.css({'top':vOffset});
      birds.prependTo(birdNav);
      birdNav.animate({'top':0}, 750, function() {
        $('.map-nav-wrap .nav-item:nth-last-child(-n+' + navItems + ')').remove();
        updateAria();
      });
    }
    if (!desktopMode && !$(birdNav).is(':animated')) {
      var width = parseInt($('.map-nav-wrap .nav-item').innerWidth());
      var hOffset = -1 * (navItems * width);
      birdNav.css({'left':hOffset});
      birds.prependTo(birdNav);
      birdNav.animate({'left':0}, 750, function() {
        $('.map-nav-wrap .nav-item:nth-last-child(-n+' + navItems + ')').remove();
        updateAria();
      });
    }
  }

  // BlockSlider and Customizations

  woodstream.BlockSlider.prototype.resetPanelCount = function() {
    this.panelCount = this.id.find('.panel').length;
  }

  var articles = new woodstream.BlockSlider('mm-articles');
  articles.resetPanelCount();

  var updateArticlesSlider = function(category) {

    // get correct articles from the articleContent array ...

    var newArticles = [];
    for (i = 0; i < articleContent.length; i++) {
      var newCat = articleContent[i].attr('data-cat');
      if (newCat == category || newCat == 'all') {
        newArticles.push(articleContent[i]);
      }
    }

    // overwrite the articles in the panal-wrap div with the new articles ...

    $('#mm-articles .panel-wrap').html(newArticles);

    // now we have to manually reset the panel count, and have the slider update its control status and ARIA tags...

    articles.resetPanelCount();
    articles.updateControls();
    articles.updateAria();

  }

  var articleContent = [];
  var articleItems = $('#mm-articles .panel');
  articleItems.each(function() {
    var content = $(this);
    articleContent.push(content);
  });
  updateArticlesSlider('annas'); // initialize with Anna's, the bird selected by default

});