/* Parallax

Usage: include this script on the page. No need to invoke anything.

You'll have a container <div> with the class 'parallax-box'. It will need to have a position of either 'absolute' or, more likely, 'relative' to contain your parallax elements, which will have to be absolutely positioned within this <div>.

Into that 'parallax-box' container you'll place all the items you want to scroll at a different speed than the document. Each of these items should have a class of 'parallax-item'. These 'parallax-item' elements would have an attribute of 'data-scrollSpeed' with a numeric value. Higher numbers scroll faster. A value of 0 would scroll at the same speed as the background. A negative value will scroll more slowly than the background.

When the container div is at the top edge of the browser viewport, that is it's "rest" point. That means if you positioned your parallax elements at 'top:0;' they would also align with the top of the browser window--no matter what speed you've set with the scrollSpeed parameter. You should put the container div in that position in order to determine where you'd like your elements at that point in the scrolling. As soon as you scroll up or down from that point, the position of those elements will vary depending on what scrollSpeed you've selected.

This is confusing. It's best to just try it. There is a lot of fine tuning involved.

Additionally, you can add a 'data-breakpoint' attribute to the container div. This takes a number, the pixel width below which the parallax will be turned off. For instance if you added:

  data-breakpoint="767"

to the container div, the parallax effect would only happen when the browser viewport is larger than 767px. Leaving out this attribute means that there is no breakpoint, and that the parallax effect will always be on.

HTML Example:

<div class="my-section-div parallax-box" data-breakpoint="479">
    <h2>This is not a parallax item.</h2>

    <div class="fast-scrolling-text parallax-item" data-scrollSpeed="20">This will scroll faster</div>
</div>

*/



(function($) {

    'use strict';

    $(window).on('resize', function() { $(window).trigger('scroll'); });

    WS.prototype.ParallaxItem = function(el) {

        this.mapRange = function(value, low1, high1, low2, high2) {
            return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
        };

        this.id = $(el);
        this.breakpoint = parseInt(this.id.data('breakpoint'));
        this.origin = parseInt(this.id.css('top'));
        var speedAttr = parseInt(this.id.data('scrollspeed'));

        if (speedAttr === undefined) {
            this.scrollSpeed = 10;
        } else {
            this.scrollSpeed = this.mapRange(speedAttr, 0, 100, 0, 5);
        }

        if (this.breakpoint === undefined) { this.breakpoint = 0; }

        this.update = function () {
            var viewport = window.innerWidth;
            if (viewport > this.breakpoint) {
                var vOffset = this.id.closest('.parallax-box').offset().top;
                var boxScrollDistance = $(window).scrollTop() - vOffset;
                var vDistance = boxScrollDistance * this.scrollSpeed;
                this.id.css('top', this.origin - vDistance);
            } else {
                this.id.css('top', 0);
            }
        }.bind(this);
    };

    var parallaxCollection = [];

    $('.parallax-box .parallax-item').each(function() {
        parallaxCollection.push(new WS.ParallaxItem(this));
    });

    $(window).on('scroll', function() {
        for (var i = 0; i < parallaxCollection.length; i++) {
            parallaxCollection[i].update();
        }
    });

})(jQuery);