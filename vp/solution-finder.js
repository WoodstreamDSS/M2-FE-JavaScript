require(['jquery'], function ($) {
  //
  // Start Animation
  //

  // Event listeners for mouse enter and mouse leave

  $('.start-options .right').on('mouseenter focusin', function () {
    startAnimation('right');
  });

  $('.start-options .left').on('mouseenter focusin', function () {
    startAnimation('left');
  });

  $('.start-options > div').on('mouseleave focusout', function () {
    // When mouse leaves either element, we set animation flag to true (to watch for end of reverse CSS transition), and clear the animation queue and class

    animating = true;
    animationQueue = '';
    $('.start-options > div').removeClass('open');
  });

  // Reset animation flag when CSS transition ends

  $('.start-options .bg').on(
    'transitionend webkitTransitionEnd oTransitionEnd',
    () => {
      animating = false;
      if (animationQueue != '') {
        startAnimation(animationQueue);
      }
    }
  );

  // Track animation status and whether a second animation is queued due to mouse moving before animation completes

  let animating = false;
  let animationQueue = '';

  // Animation handler

  const startAnimation = function (dir) {
    if (!animating) {
      animating = true;
      $(`.start-options .${dir}`).addClass('open');
    } else {
      // If we're animating, but the mouse has moved, queue the animation for the new element

      animationQueue = dir;
    }
  };

  // Slider invocation

  const sliders = [
    'option-slider',
    'pest-category-slider',
    'solution-slider',
    'resource-slider',
  ];
  let sliderCollection = [];
  for (let i = 0; i < sliders.length; i++) {
    if ($(`#${sliders[i]}`).length > 0) {
      sliderCollection.push(new woodstream.BlockSlider(sliders[i]));
    }
  }

  // Update active slider option

  const currentOption = $('.solution-finder').attr('data-option');
  if (currentOption) {
    $(`.option.${currentOption}`).attr('aria-selected', true);
  }
  if (window.innerWidth < 960) {
    let optionidx = $('#option-slider .panel[aria-selected="true"]').index();
    if (optionidx != 0) {
      $('#option-slider .panel[aria-selected="true"]').prependTo(
        $('#option-slider .panel-wrap')
      );
    }
  }

  // Update active solution option

  const currentSolution = $('.solution-finder').attr('data-solution');
  if (currentSolution) {
    $('#solution-slider').addClass('links');
    $(`#solution-slider .panel.${currentSolution}`).attr('aria-selected', true);
  }
  if (window.innerWidth < 960) {
    let solutionidx = $(
      '#solution-slider .panel[aria-selected="true"]'
    ).index();
    if (solutionidx != 0) {
      $('#solution-slider .panel[aria-selected="true"]').prependTo(
        $('#solution-slider .panel-wrap')
      );
    }
  }

  // Update ID Your Problem Link

  if (window.location.pathname == '/solution-finder/id') {
    woodstream.setCookie('sf-path', 'where');
  }
  if (window.location.pathname == '/solution-finder/id/choose') {
    woodstream.setCookie('sf-path', 'what');
  }
  currentPath = woodstream.getCookie('sf-path');
  if (currentPath == 'what') {
    $('.sf-nav-button.id').attr('href', '/solution-finder/id/choose');
  }

  // Equal height for detail descriptions on desktop

  const details = $('.details .detail .detail-desc');
  if (details.length > 0) {
    const detailsEH = new woodstream.EqualHeight(details, 959);
  }

  // Option Slider panel equal height

  const optionPanels = $('#option-slider .panel span');
  let optionPanelsEH;
  if (optionPanels.length > 0) {
    optionPanelsEH = new woodstream.EqualHeight(optionPanels, 0);
  }

  // Option Slider panel equal height

  const solutionPanels = $('#solution-slider .panel h3');
  let solutionPanelsEH;
  if (solutionPanels.length > 0) {
    solutionPanelsEH = new woodstream.EqualHeight(solutionPanels, 0);
  }

  // Header Update

  const currentPageset = $('.solution-finder').attr('data-pageset');
  $(`.sf-nav-button.${currentPageset}`).attr('aria-selected', true);

  $(`.sf-nav-button.solution`).css('pointer-events', 'none');
  if (currentPageset == 'start') {
    $(`.sf-nav-button.id`).css('pointer-events', 'none');
  }
});
