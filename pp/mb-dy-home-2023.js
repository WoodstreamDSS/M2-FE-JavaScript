require(['jquery'], function ($) {
  let reviewSlider = new woodstream.BlockSlider('review-slider');

  let megamenuMode = window.innerWidth < 768 ? 'mobile' : 'desktop';

  const toggleMobileNav = (state) => {
    let newState;

    if (!state) {
      state = $('.pp-home-nav').attr('aria-hidden');
      newState = state == 'true' ? false : true;
    } else {
      newState = state;
    }
    $('.pp-home-nav, .mobile-nav-screen').attr('aria-hidden', newState);
  };

  const updateNavMode = () => {
    if (megamenuMode == 'mobile') {
      toggleMobileNav('true');
    }
    megamenuMode = window.innerWidth < 768 ? 'mobile' : 'desktop';
    $('.pp-home-nav').attr('data-nav-mode', megamenuMode);
  };

  $(window).on('resize', () => {
    updateNavMode();
  });

  if (window.innerWidth > 767) {
    $('.pp-home-nav').css('display', 'block');
  } else {
    $('.pp-home-nav').attr('data-nav-mode', 'true');
    setTimeout(() => {
      $('.pp-home-nav').css('display', 'block');
    }, 250);
  }

  $('.mobile-menu-toggle, .mobile-nav-screen').on('click', (e) => {
    toggleMobileNav();
  });

  if (megamenuMode == 'mobile') {
    toggleMobileNav();
  }

  $('.nav-item-wrap > li').on('mouseover', (e) => {
    if (window.innerWidth > 767) {
      openMegamenu(e);
    }
  });

  $('.nav-item-wrap > li').on('mouseout', (e) => {
    if (window.innerWidth > 767) {
      closeMegamenu(e);
    }
  });

  $('.nav-item-wrap > li').on('focusin', (e) => {
    if (window.innerWidth > 767) {
      openMegamenu(e);
    }
  });

  $('.nav-item-wrap > li').on('focusout', (e) => {
    if (window.innerWidth > 767) {
      let contains = $(e.currentTarget).find($(e.relatedTarget)).length > 0;
      if (!contains) {
        closeMegamenu(e);
      }
    }
  });

  const openMegamenu = (e) => {
    let el = e.currentTarget;
    if (el.tagName == 'A') {
      el = el.parentElement;
    }
    $(el).find('.pp-megamenu-container').attr('aria-hidden', false);
    let links = $(el).find('.pp-megamenu a');
    links.attr('tabindex', 0);
  };

  const closeMegamenu = (e) => {
    let el = e.currentTarget;
    if (el.tagName == 'A') {
      el = el.parentElement;
    }
    $(el).find('.pp-megamenu-container').attr('aria-hidden', true);
    let links = $(el).find('.pp-megamenu a');
    links.attr('tabindex', -1);
  };

  // Mobile top-level handling

  $('.pp-home-nav .nav-item-l1:not(.mobile-active)>a').on(
    'click',
    function (e) {
      if (megamenuMode == 'mobile') {
        e.preventDefault();
        let state = $(e.currentTarget).parent('li').attr('data-mobile-open');
        let newState = state == 'true' ? false : true;
        $(e.currentTarget).parent('li').attr('data-mobile-open', newState);
      }
    }
  );

  // handle scrolling of mobile nav

  let mobileYPos = 0;
  let mobileNav = $('#mobile-nav');
  let mobileNavContent = $('#mobile-nav .content');
  let minY = 0;

  $(window).on('resize', () => {
    mobileYPos = 0;
    let mode = $('#mobile-nav').attr('data-nav-mode');
    let newTop = mode == 'desktop' ? '26em' : 0;
    mobileNav.css({ top: newTop });
  });

  const recalculateMinY = () => {
    let viewportHeight = mobileNav[0].getBoundingClientRect().height;
    let navHeight = mobileNavContent[0].getBoundingClientRect().height;

    newMinY = viewportHeight - navHeight;

    if (newMinY > 0) {
      newMinY = 0;
    }
    minY = newMinY;
    if (mobileYPos < minY) {
      mobileNav.css('top', minY);
      mobileYPos = minY;
    }
  };
  recalculateMinY();

  $('#mobile-nav a, #mobile-nav button').on('click', function () {
    recalculateMinY();
  });

  const mobileTouchHandler = (obj) => {
    if (window.innerWidth < 768) {
      let newIndex = mobileYPos + obj.yMove;

      if (obj.status == 'start') {
        recalculateMinY();
        $('body').css('position', 'fixed');
      }

      if (obj.status == 'move') {
        if (newIndex > 0) {
          newIndex = 0;
        }
        if (newIndex < minY) {
          newIndex = minY;
        }
        mobileNav.css({ top: newIndex });
      }

      if (obj.status == 'end') {
        if (newIndex <= 0) {
          mobileYPos = mobileYPos + newIndex;
        } else {
          mobileYPos = 0;
        }
        $('body').css('position', 'static');
      }
    }
  };

  let mobileNavTouch = new woodstream.TouchObj(
    'mobile-nav',
    mobileTouchHandler
  );

  // fix for non-functioning submenus

  const updateMobileMenu = (target) => {
    if (woodstream.megamenuMobileMode) {
      let group = target.next('.link-group');
      let state = group.attr('aria-hidden') == 'true';
      group.attr('aria-hidden', !state);
    }
  };

  $('.menu-column h3.heading button.mobileArrow').on('click', function () {
    let target = $(this).parent('h3');
    updateMobileMenu(target);
  });
});
