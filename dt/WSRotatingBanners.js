woodstream.RotatingBanner = class {
  constructor(id) {
    // We take the incoming id and find the element with that id

    this.id = id;
    this.el = $(`#${id}`);

    // We pull in the settings from the data-attributes

    this.autoplay = this.el.attr('data-autoplay') == 'true'; // whether or not the banner should autoplay
    this.navCircles = null; // if we have nav circles, we'll store them here
    this.circlesEnabled = this.el.attr('data-circles') == 'true'; // whether or not to show the navigation circles
    this.arrowsEnabled = this.el.attr('data-arrows') == 'true'; // whether or not to show the navigation circles
    this.delay = parseInt(this.el.attr('data-delay')); // the delay between rotations
    this.currentPanel = 0; // the current panel we're viewing
    this.animationSpeed = 250; // the speed of the animation in milliseconds
    this.paused = false;
    this.midDrag = false;

    // Now we need to observe when touch/drag events occur. We use the woodstream.TouchObj class to do this. We pass the id of the banner to this class, and it will watch for touch events on the banner. When it detects a touch event, it will call the touchHandler method, passing it the TouchObj object, which contains information about the touch event.

    if (woodstream.TouchObj) {
      this.touch = new woodstream.TouchObj(
        this.id,
        this.touchHandler.bind(this)
      );
    }
    this.currentOffset = 0; // variable to keep track of the current horizontal offset of the banner
    this.dragPanelAdded = false;
    this.prevOffset = 0;

    // We set up an event listener to watch for keystrokes when the banner has focus. We'll need to watch for the arrow keys, and the space bar.

    this.el.on('keydown', (e) => {
      this.keyHandler(e);
    });

    // We grab a few other elements from the DOM that we'll need later.

    this.mask = $(`#${id} .wrb-mask`); // this is the mask that hides the banner when it's outside the display area.
    this.collection = $(`#${id} .wrb-collection`); // this is the collection of all the banner panels.
    this.panels = $(`#${id} .wrb-collection>div`); // this is an array of all the panels in the collection.

    // We also pick up some initial data about the banner that we will need.

    this.panelCount = this.collection.children().length; // number of banner panels
    this.panelWidth = this.collection.children().outerWidth(); // current width of panels (we may not need this)

    // we're going to handle all the ARIA-related bits here, for accessibility.

    this.initializeAria();
    this.renderControls();

    // if the option to display navigation circles is set to true, we'll need to create the navigation circles.

    if (this.circlesEnabled) {
      this.renderCircles();
    }

    // We also need to update aria, which will ensure the tabbable elements on hidden banners are inaccessible

    this.updateAria();

    // if autoplay has been enabled, we'll want to start that up as well

    if (this.autoplay) {
      this.autoplayInit();
    }
  }

  renderControls() {
    // We're going to create the previous and next buttons dynamically. First we create the two buttons.

    if (this.arrowsEnabled) {
      let nextControl = document.createElement('button');
      let prevControl = document.createElement('button');

      // Then we give them the appropriate classes and attributes. In this case since we don't necssarily have text inside the button, we give them an aria-label so screen readers can announce what the button does.

      $(nextControl).attr({
        id: 'wrb-next',
        'aria-label': 'Next',
      });
      $(prevControl).attr({
        id: 'wrb-prev',
        'aria-label': 'Previous',
      });

      // We add the buttons to the DOM. We add the previous button to the beginning of the banner wrapper, and teh next button after. This way, the tab order will be to the button first, then to any links inside the banner itself, and then the next button.

      $(this.el).prepend(prevControl);
      $(this.el).append(nextControl);

      /*

      After they've been added to the DOM we can then assign event listeners to them, to go to the next or previous panel.

      */

      $(`#${this.id} #wrb-next`).on('click', () => {
        this.next();
      });
      $(`#${this.id} #wrb-prev`).on('click', () => {
        this.prev();
      });
    }
  }

  renderCircles() {
    /*

    Now we're going to render the navigation circles. We'll create a div with the class 'wrb-circles' and give it an ARIA role of 'tablist'. Then for each banner in the collection, we'll create a button with the classs 'wrb-circle'. Each circle gets a bunch of attributes:

      an index so it can be easily idenitified later
      an ARIA role indicating to assistive technologies that this is a tab button
      an aria-controls attribute that points to the banner id associated with that button
      an aria-label which acts sort of like alt text for the button
      an aria-selected flag that indicates whether or not the button has been selected by the user
      and a custom ID

    All but the first buttons will be marked as not selected. The first banner is always considered visible and selected when the page loads.

    */

    let circles = document.createElement('div');
    $(circles).addClass('wrb-circles').attr('role', 'tablist');

    for (let i = 0; i < this.panelCount; i++) {
      // Create the button ...
      let circle = document.createElement('button');

      // ... give it the appropriate attributes

      $(circle)
        .addClass('wrb-circle')
        .attr({
          'data-index': i,
          role: 'tab',
          'aria-controls': 'panel-' + i,
          'aria-label': 'Go to panel ' + i,
          id: 'circle-' + i,
          'aria-selected': 'false',
        });

      if (i === 0) {
        // This is the first nav circle, so we'll mark it as selected.

        $(circle).attr('aria-selected', 'true');
      }

      // Append the newly created circle to the circles div.

      circles.appendChild(circle);
    }

    // Now append the circles container to the DOM, in this case at the end of the div so that it comes at the end of banner's tab order.

    this.el.append(circles);

    // Now we need to assign event listeners to each of the circles, so we can go to the appropriate panel when each is clicked.

    this.navCircles = $(`#${this.id} .wrb-circles .wrb-circle`);
    this.navCircles.on('click', (e) => {
      this.circleHandler(e);
    });
  }

  circleHandler(e) {
    /*

    Clicking on a nav circle allows us to directly navigate to a panel

    When we click a circle, we get a target index for the panel we want to go to. Here we just keep going to the next panel until we reach the target index. We pass 'true' to the this.next function, which tells it to bypass the animation, so the direct navigation to the panel seems immediate. If the 'true' is removed from the this.next function call below, it won't work correctly: the while loop will send a bunch of calls over to this.next immediately, but we're ignoring calls that happen while the animation is happening. So all those calls will be ignored.

    */

    let targetPanel = $(e.target).attr('data-index');
    while (this.currentPanel != targetPanel) {
      this.next(true);
    }
  }

  initializeAria() {
    // We need to set up the ARIA attributes for the banner, for those using assistive technology like screen readers. This will let the software know exactly how the banner functions and what to expect when a user interacts with it.

    // set each panel in the collection to role 'tabpanel', and set all but the first one to aria-hidden='true'. Also add custom ids, and add an index attribute so we can identify it later. This same custom id is the same as the 'aria-controls' attribute for the nav circle.

    for (let i = 0; i < this.panels.length; i++) {
      $(this.panels[i]).attr({
        id: 'panel-' + i,
        role: 'tabpanel',
        'aria-hidden': 'true',
        'data-index': i,
      });

      // First panel is visible at page load, so we'll mark it as selected.

      if (i === 0) {
        $(this.panels[i]).attr('aria-hidden', 'false');
      }
    }
  }

  updateAria() {
    // We're going to check the current panel and update the aria-selected attribute on the appropriate circle.

    // first, which panel is now visible> We'll mark all panels as hidden, and then the current panel as visible.

    let current = this.currentPanel; // we won't be able to access the this.currentPanel property in the anonymouse function below, so we'll store it in a local variable.

    // also note, we can't use the this.panels variable to loop through the panels because we've been cloning and deleting them every time we slide panels. So we'll just have to grab them all again. There might be a better way to do this, but for now this works fine.

    // Grab all the panels again and loop through them...

    $(`#${this.id} .wrb-collection>div`).each(function () {
      // get the index of the panel

      let index = parseInt($(this).attr('data-index'));

      // This might look a little cryptic. The (index != current) is evaluated to true or false. If the index of the current panel is equal to the current panel, it returns true, otherwise it returns false. So we set the aria-hidden attribute to the opposite of the result. (WHen the expression is true, we want aria-hidden to be false and vice versa.)

      $(this).attr('aria-hidden', !(index == current));
    });

    // Now let's do basically the same thing with the navigation circles. Because we're not deleting and cloning them, we can just loop through them. Except in this case we want the aria-selected attribute to be the same as teh result of the (index == current) expression, not the opposite. (When the expression is true, we want aria-selected to be true and vice versa.)

    if (this.navCircles !== null) {
      this.navCircles.each(function () {
        let index = parseInt($(this).attr('data-index'));
        $(this).attr('aria-selected', index == current);
      });
    }

    // In all hidden panels we'll set the links inside it to not be available in the tab order (we don't want keyboard users to be able to tab into them when they're hidden), and make sure that <a> elements in the visible panel are available in the tab order.

    // We could be more comprehensive here, since there are more tabbable elements than just <a> elements--however, in our banners we typically only use regular <a> elements, so this is good enough.

    $(`#${this.id} .wrb-collection>div`).each(function () {
      if ($(this).attr('aria-hidden') == 'true') {
        $(this).find('a').attr('tabindex', '-1');
      } else {
        $(this).find('a').attr('tabindex', '0');
      }
    });
  }

  keyHandler(e) {
    // this is pretty simple: if the key pressed is the left arrow, we'll call the prev function. If the right arrow is pressed, we'll call the next function. Focus needs to be someonwehre in the banner itself when the key is pressed.

    if (e.keyCode == 39) {
      this.next();
    }
    if (e.keyCode == 37) {
      this.prev();
    }
  }

  touchHandler(obj) {
    // For more information on how the touch events work, see the following: /js/src/TouchObj.js

    // There are three stages to any touch event: when it starts, when the finger is moved, and when the touch event ends. This is reported back to us in the obj.status property. Like the resize event, this event is triggered over and over again rapidly. Also keep in mind that this function is called every time, and that means that if you want to access a variable consistently through all the calls of a touch interaction, you should store it in the class scope. If you set a local variable in the function, it will not be available the next time the touchHander function is called.

    if (obj.status == 'start') {
      // When the touch interaction begins, we set the offset to zero. The panels should be at rest at 0 left margin at this point. We're going to monitor for chantges. We'll also set the dragPanelAdded variable to false. You'll see what this does in the next section.

      this.currentOffset = 0;
      this.dragPanelAdded = false;
      this.midDrag = true;
    }
    if (obj.status == 'move') {
      // Because of how the panels are set up, dragging to the left is straightforward. In this case we simply move the absolutely positioned collection of panels to the left by the amount of the touch movement (the number of pixels dragged is available in the obj.xMove variable).

      // Dragging to the right is more complicated. There is no panel to the left of the first panel in the banner. When we drag to the right there will be nothing there to see. So when we detect that the drag is to the right we need to copy and append the last panel of the collection to the beginning of the collection. This means we also need to update the offset of the collection to account for this additional panel. We store this in a class-scoped variable (this.prevOffset) so that we can subtract it from the drag distance. We set the dragPanelAdded variable to true, so that we only append that last panel to the beginning of the collection once.

      if (obj.xMove > 0 && !this.dragPanelAdded) {
        // When obj.xMove is positive, we're moving to the right, and the dragPanelAdded flag is false, so we haven't added the last panel to the beginning of the collection yet.

        // We find and clone the last panel in the collection.

        let lastBanner = $(this.collection).children().last();
        let bannerCopy = lastBanner.clone(true);

        // We prepend the banner to the collection

        this.collection.prepend(bannerCopy);

        // Since all our banners are the width of the document, we set the offset to that width, and then update the dragPanelAdded flag to true

        this.prevOffset = $(document).innerWidth();
        this.dragPanelAdded = true;

        // and now the offset of our banner is not just how much the user has dragged, but how much the user has dragged minus the width of the new panel.

        this.currentOffset = obj.xMove - this.prevOffset;
      } else if (obj.xMove > 0 && this.dragPanelAdded == true) {
        // We're still moving to the right, but this time we know the panel has already been added.
        // So like before, our offset is now how much the user has dragged minus the width of the new panel.

        this.currentOffset = obj.xMove - this.prevOffset;
      } else if (obj.xMove < 0 && this.dragPanelAdded) {
        // if we're dragging to the left, we can just move the panels normally. except ...
        // We need to check if the user has first dragged to the right, becuase that extra banner will be there.

        $(this.collection).children().first().remove();
        this.dragPanelAdded = false;
        this.prevOffset = 0;

        // We've removed the banner, so now the offset is just the distance the user has dragged.

        this.currentOffset = obj.xMove;
      } else if (obj.xMove < 0 && !this.dragPanelAdded) {
        // We're moving to the left, and there's no additional panel to worry about, so our offset is just the distance the user has dragged.

        this.currentOffset = obj.xMove;
      }

      // Update the left attribute of the collection to reflect the current offset.

      this.collection.css({ left: this.currentOffset + 'px' });
    }
    if (obj.status == 'end') {
      // When the touch interaction ends, we have to account for a few different possibilities:

      // The user has dragged far enough left that we can now go to the next panel
      // The user has NOT dragged far enough left to go to the next panel
      // The user has dragged far enough right that we can now go to the previous panel
      // The user has NOT dragged far enough right to go to the previous panel

      this.paused = false;
      let docWidth = $(document).innerWidth();

      // If obj.xMove is less than zero, we assess whether it is far enough to justify moving to the next panel

      if (obj.xMove < 0) {
        // user has to swipe 25% of the way to the next panel to trigger the move

        if (Math.abs(obj.xMove) > docWidth / 4) {
          this.next();
        } else {
          // if not, we'll just move back to the original position

          this.collection.animate({ left: 0 }, 100);
        }
      }

      // Things are more complicated with sliding to the previous panel, because we've had to add a new panel to the beginning of the collection.

      if (obj.xMove > 0) {
        // if user has moved enough to trigger going to the previous panel, we need to do some gymnastics with the panels.

        if (obj.xMove > docWidth / 4) {
          this.prev(false, true);
        } else {
          this.collection.animate({ left: '-100vw' }, 100, () => {
            $(this.collection).children().first().remove();
            $(this.collection).css({ left: 0 });
          });
        }
      }

      this.midDrag = false;
    }
  }

  next(immediate = false) {
    // We'll want to slide to the next panel. We're going to slide the entire collection div to the left by the width of one panel (which should be 100vw). Then we're going to copy the leftmost panel, append it to the end of the collection div, and then simultaneously delete the leftmost div and snap it back to the right. Don't worry, it happens fast enough that it looks natural.

    // By default we'll want to animate the transition. If we're calling this funcction from elsewhere (like the circleHandler) we'll want to skip the animation.

    // First, since the animation will take a moment and the user might click the button more than once, we only want to do this if there isn't already an animation in progress.

    let speed = immediate ? 0 : this.animationSpeed;

    if (!$(this.collection).is(':animated')) {
      // clone the first banner, and append it to the end of the collection

      let firstBanner = $(this.collection).children().first();
      let bannerCopy = firstBanner.clone(true);
      $(this.collection).append(bannerCopy);

      // Animate the panel

      $(this.collection).animate({ left: '-100%' }, speed, () => {
        // When the animation is complete, delete the first banner, reset the margin, and update the current panel index

        firstBanner.remove();
        $(this.collection).css({ left: '0' });
        this.currentPanel = (this.currentPanel + 1) % this.panelCount;

        // Update all the ARIA attributes

        this.updateAria();
      });
    }
  }

  prev(immediate = false, skipClone = false) {
    // This works the opposite way as the next function. We clone the last banner, and place it at the beginning of the collection dive, while simultaneously setting the left value to -100vw. Then we animate the collection div left value to zero. Then delete the trailing banner div.

    let speed = immediate ? 0 : this.animationSpeed;

    if (!$(this.collection).is(':animated')) {
      let lastBanner = $(this.collection).children().last();
      let bannerCopy = lastBanner.clone(true);

      if (!skipClone) {
        $(this.collection).prepend(bannerCopy).css({ left: '-100%' });
      }

      $(this.collection).animate({ left: '0' }, speed, () => {
        lastBanner.remove();
        this.currentPanel--;
        if (this.currentPanel < 0) {
          this.currentPanel = this.panelCount - 1;
        }

        // Update all the ARIA attributes

        this.updateAria();
      });
    }
  }

  autoplayControl() {
    this.paused = !this.hovered && !this.focused ? false : true;

    if (this.paused) {
      clearInterval(this.interval);
    } else {
      this.autoplayInit();
    }
  }

  autoplayInit() {
    // Automatically switch to the next panel after a set number of seconds, if the option has been selected.

    // We want to pause the autoplay when a user is hovering over the banner, or if the focus is within the banner. We unpause when both of those conditions are false.

    this.interval = setInterval(() => {
      if (!this.paused && !this.midDrag) {
        this.next();
      }
    }, this.delay);

    this.el.on('mouseenter', () => {
      this.hovered = true;
      this.autoplayControl();
    });

    this.el.on('mouseleave', () => {
      this.hovered = false;
      this.autoplayControl();
    });

    this.el.on('focusin', () => {
      this.focused = true;
      this.autoplayControl();
    });

    this.el.on('focusout', () => {
      this.focused = false;
      this.autoplayControl();
    });
  }
};

// Initialize the rotating banners.

let bannerCollection = [];
$('.ws-rotating-banner').each(function () {
  let id = $(this).attr('id');
  bannerCollection.push(new woodstream.RotatingBanner(id));
});
