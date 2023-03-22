require(['jquery'], function($) {
  let index = 0;
  let newIndex;
  let maxIndex = $('#home-app>section').length - 1;
  let direction;
  let animating = false;
  let processingScroll = false;

  // Looks for the gyroscope on mobile phones. If it's available, we may be able to use it to activate the parallax effect. For now, it does nothing more than report whether it's available.

  let gyroscope = new Gyroscope({frequency:60});
  console.log(`Gyroscope available: ${gyroscope.activated}`);

  // Function for playing/pausing the video in panel one.

  const videoStateUpdate = (state) => {
    state ? $('#home-app>section[data-index="0"] video')[0].play() : $('#home-app>section[data-index="0"] video')[0].pause();
  }

  // We update the section background based on which section we're in. This will also hide the indicator on index panels above 3, since it lives within the .lc-content div.

  const updateMode = () => {
    if (index > 0) {
      $('.home-header').fadeOut(500);
      $('.section-heading').fadeIn(500);
    } else {
      $('.home-header').fadeIn(500);
      $('.section-heading').fadeOut(500);
    }
    if (index > 0 && index < 4) {
      $('.section-heading h2.learning-center').show();
      $('.section-heading h2.bird-library').hide();
    }
    if (index >= 4) {
      $('.section-heading h2.learning-center').hide();
      $('.section-heading h2.bird-library').show();
    }
    if (index > 3) {
      $('.lc-content').fadeOut(500);
      $('.bl-content').fadeIn(500);
      $('.section-heading').fadeIn(500);
    } else {
      $('.lc-content').fadeIn(500);
      $('.bl-content').fadeOut(500);
    }
  }

  //
  // Panel animation controls
  //

  /*

  We're using CSS animations for controlling the panel animations. Basically these are all absolutely positioned, and are dynamically put into place and scrolled in/out of view. There's no actual page scrolling going on.

  Additionally, we use these functions to trigger the animations of objects coming in and out of the panel. There's no CSS animation here, just a transition. Each object has its position set by default. When its "data-state" is set to "off" this triggers CSS which sets the object's off-screen position, and the animation is handled by a CSS transition.

  We then update other UI elements as needed.

  */

  const scrollUp = () => {
    $(`#home-app>section[data-index="${index}"]`).removeClass('up-on up-off down-on down-off').addClass('up-off');
    $(`#home-app>section[data-index="${index}"] .animated-object`).attr('data-state', 'up');
    $(`#home-app>section[data-index="${newIndex}"]`).removeClass('up-on up-off down-on down-off').addClass('up-on');
    $(`#home-app>section[data-index="${newIndex}"] .animated-object`).attr('data-state', 'off');
    index = newIndex;
    updateApp();
    updateIndicator();
    updateMode();
  }

  const scrollDown = () => {
    // In this case, we want to start the video before we scroll it down into position
    if (newIndex == 0) { videoStateUpdate(true); }

    $(`#home-app>section[data-index="${index}"]`).removeClass('up-on up-off down-on down-off').addClass('down-off');
    $(`#home-app>section[data-index="${index}"] .animated-object`).attr('data-state', 'down');
    $(`#home-app>section[data-index="${newIndex}"]`).removeClass('up-on up-off down-on down-off').addClass('down-on');
    $(`#home-app>section[data-index="${newIndex}"] .animated-object`).attr('data-state', 'off');
    index = newIndex;
    updateApp();
    updateIndicator();
    updateMode();
  }

  // Since we're scrolling by several different means (by swiping and by mouse scroll) we have this function to handle which direction we're scrolling. Other functions will send a positive integer to scroll up (and by up I mean that the panels visually move upward) or down (panels scroll visually downward). We use animating as a flag to indicate whether we are or are not in the middle of an animation, so we can restrict excessive scrolling (which tends to overwhelm the browser and cause panels to not appear correctly).

  const scrollHandler = () => {
    animating = true;
    direction > 0 ? scrollUp() : scrollDown();
  }

  const scrollDebounce = woodstream.Debounce(scrollHandler, 250, true);

  // Scrolling event handlers

  const scrollLogic = (increment) => {

    // Flag to indicate that we're currently processing a scroll event
    processingScroll = true;

    // Assume for now that we're able to scroll in the desired direction
    let scrolling = true;

    // we use a global variable to indicate the current panel index and the newIndex, which is the panel we want to scroll to. Increment should be -1 or 1, but we try to handle the possibility of larger numbers just in case
    newIndex = index;
    newIndex += increment;

    // If we're at index 0 we can't scroll down any further. If we're at maxIndex we can't scroll up, so we set the scrolling flag to false. If we're at index 3 of five, technically we could recieve an increment of 3 and scroll to index 5 (rather than 6). That shouldn't happen here, but we handle that anyway.
    if (newIndex < 0 && index == 0) { newIndex = 0; scrolling = false; }
    if (newIndex < 0 && index != 0) { newIndex = 0; scrolling = true; }
    if (newIndex > maxIndex && index == maxIndex) { newIndex = maxIndex; scrolling = false; }
    if (newIndex > maxIndex && index != maxIndex) { newIndex = maxIndex; scrolling = true; }

    // We check if we are actually scrolling, and also checking to make sure we're not in the middle of a scroll animation. If we are currently animating, then we will not scroll.
    if (scrolling && !animating) {
      direction = increment;
      scrollDebounce();
    } else {
      // Since we're not going to scroll, we're done. We clear the processingScroll flag
      processingScroll = false;
    }
  }

  // We listen for up arrow and down arrow, so the user can also scroll with the keyboard if necessary

  $(document).on('keyup', (e) => {
    if (e.key == 'ArrowUp') { scrollLogic(-1); }
    if (e.key == 'ArrowDown') { scrollLogic(1); }
  });

  // Listen for the mouse wheel to scroll

  window.addEventListener('wheel', function(e) {
    if (!processingScroll) {
      let indexIncrement = 0;
      e.deltaY > 0 ? indexIncrement = 1 : indexIncrement = -1;
      scrollLogic(indexIncrement);
    }
  });

  // App update function, on panel change. This may be unnecessary.

  const updateApp = () => {
    $('#home-app').attr('data-index', index);
  }

  // Routines to run after panel completes its movement animation

  const postPanelAnimation = () => {
    animating = false;
  }
  $('#home-app>section').on('animationend', postPanelAnimation);

  // Routines to run after panel elements complete their animations

  const animationComplete = () => {

    // Remove all the animation classes
    $(`#home-app>section:not([data-index="${index}"])`).removeClass('up-on up-off down-on down-off').addClass('off');

    // If the video panel is not visible, we want to pause the video.
    if (index !== 0) { videoStateUpdate(false); };

    // We change the state of this variable so other functions know we aren't currently scrolling
    processingScroll = false;
  }

  // Again, we debounce because there are lots of objects animating, and they will all fire this function when their animations complete, but we only need the function to fire once. They will all fire nearly simultaneously, so we wait a quarter second.
  const postItemAnimation = woodstream.Debounce(animationComplete, 250, true);

  // This will fire when the CSS animations on the animated object is finished.
  $('#home-app>section .animated-object').bind('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', postItemAnimation);




  //
  // Routine to handle updating the learning center section indicator
  //

  const updateIndicator = () => {

    // We're basically monitoring the progress through three very specific panels, if we're on other panels this won't show
    let panelCount = 3;
    let percentage = (100 / panelCount) * index;

    // On mobile, the indicator flips sideways, so we swap height and width
    if (window.innerWidth > 767) {
      $('#indicator .percentage').css({'height':`${percentage}%`, 'width':'100%'});
    } else {
      $('#indicator .percentage').css({'width':`${percentage}%`, 'height':'100%'});
    }

    // We hide the indicator when the index is 0 (the video panel). It's also hidden above panel 3, but that is taken care of elsewhere because the entire background image div gets hidden, and that includes the indicator.
    if (index == 0) {
      $('#indicator').fadeOut(500);
    } else {
      $('#indicator').fadeIn(500);
    }
  }

  // We need to run the function once when the page first loads to style the indicator
  updateIndicator();

  // Because the positioning of the indicator changes based on the width of the viewport, we need to recheck every time the window is resize.
  $(window).on('resize', updateIndicator);

  // When someone swipes on the indicator, we want to navigate to the next/previous section

  const indicatorNavHandler = (obj) => {
    if (obj.status == 'end' && !processingScroll) {
      let indexIncrement = 0;

      // 50 is an arbitrary value. It's a small enough number of pixels that even small swipes will register, but large enough that accidental touches will not register.
      if (obj.yMove > 50) { indexIncrement = 1; }
      if (obj.yMove < -50) { indexIncrement = -1; }
      scrollLogic(indexIncrement);
    }
  }

  const indicatorNav = new woodstream.TouchObj('indicator', indicatorNavHandler);





  //
  // Parallax Movement Code
  //

  // Parallax Object

  // We do this to store inmdividual data about each object, since they will have different weights, maxMovement, etc. This is likely faster than querying the DOM each time we call this function to grab these from the HTML.

  woodstream.ParallaxObject = class {
    constructor(id, panel, maxMovement, weight) {
      this.id = id;
      this.el = $(`#${id}`);

      // Panel this object resides in
      this.panel = panel;

      // This tells us how much of the maxMovement will apply to this object. Background objects will be "lighter" than foreground objects.
      this.weight = weight;

      // This is the maximum amount of pixels we will allow the object to move in each direction. For example, a maxMovement of 50px will allow the object to move 50px up or 50px down from its resting position. The same would be true of left and right. There are no separate settings for both X and Y but that might need to change.
      this.maxMovement = maxMovement;
    }

    move(obj) {
      /*

      We calculate the number of pixels we want to nudge the element in both X and Y directions.

      We multiply the normalized distance from the center from the maximum amount the object can move. So if the mouse is halfway between the center of the viewport and the edge, we'll set this to half of the maximum movement.

      Then we multiply by that object's weight. Objects further in the background will move less than foreground objects. This is what creates the three dimensional effect. So if the maxumum movement of the object is 100px, and the mouse is halfway away from the object, we can move it 50px. If the weight is 0.5, we'll only move it 25px. if the weight is 0.1 we'll only move it 5px. If the weight was 1, we'd move it the full 50px.

      Additionally, we multiply these by -1 because we want the movement to be in the opposite direction as the mouse. When the mouse is on the left side of the center, we want the object to move right. If the mouse is above the center of the screen, we want the object to move down. And vice versa.

      */
      let xMove = -1 * parseInt(obj.nx * this.maxMovement * this.weight);
      let yMove = -1 * parseInt(obj.ny * this.maxMovement * this.weight);

      // We use transform to nudge the element, because using 'left' or 'top' to adjust the positioning of the element would disrupt its resting point for the CSS animation. We can then be sure the animation for the object entering and leaving the viewport will not be disrupted by the parallax animation.
      $(this.el).css({
        'transform':`translate(${xMove}px, ${yMove}px)`
      });
    };
  }

  let parallaxPanels = []; // an array of panels each holding an array of woodstream.ParallaxObject objects

  $('#home-app>section').each(function(i) {
    let pObjects = $(this).find('.parallax-object');
    panelObjects = [];
    pObjects.each(function(j) {
      let id = `id-${i}-${j}`;
      $(this).attr('id', id);
      let weight = parseFloat($(this).attr('data-weight'));
      panelObjects.push(new woodstream.ParallaxObject(id, i, 10, weight));
    });
    parallaxPanels.push(panelObjects);
  });

  // Handles the mouse positioning event, for parallax

  const parallaxHandler = (pageX, pageY) => {

    // Calculate center of viewport
    let xCenter = parseInt(window.innerWidth / 2);
    let yCenter = parseInt(window.innerHeight / 2);

    // Figure out how far away from center the mouse is in both X and Y directions
    let deltaX = pageX - xCenter;
    let deltaY = pageY - yCenter;

    // Calculate the furthest we can get the mouse from the center
    let maxFromCenter = Math.sqrt((xCenter * xCenter) + (yCenter * yCenter));

    // Calculate the angular distance from the current mouse position to the center (we may not need this)
    let deltaFromCenter = parseInt(Math.sqrt((deltaX * deltaX) + (deltaY * deltaY)));

    // Nomalize distances to a value between 0 and 1 for angular distance, and between -1 and 1 for X and Y
    let normalizedDistance = (deltaFromCenter / maxFromCenter).toFixed(4);
    let normalX = deltaX / xCenter;
    let normalY = deltaY / yCenter;

    // Store all these calculated values in an object
    let parallaxData = {'dx':deltaX, 'dy':deltaY, 'nx':normalX, 'ny':normalY, 'dist':deltaFromCenter, 'nDist':normalizedDistance};

    // if there are parallax objects in the currently active panel, pass the parallaxData object to the parallaxObject class that was created for each of them. The class will handle the actual movement.
    if (parallaxPanels[index].length > 0) {
      for (let i = 0; i < parallaxPanels[index].length; i++) {
        let obj = parallaxPanels[index][i];
        obj.move(parallaxData);
      }
    }
  }

  // We need to debounce this function, otherwise it may be called too quickly for the browser to respond, and cause stuttering
  const parallaxHandlerDebounce = (x,y) => {
    woodstream.Debounce(parallaxHandler(x,y), 20);
  }

  document.onmousemove = (e) => {
    // When the mouse moves, we grab its location and hand it off to the debounced handler function
    parallaxHandlerDebounce(e.pageX, e.pageY);
  }

});