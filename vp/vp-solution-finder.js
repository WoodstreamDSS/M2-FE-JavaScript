// require(['jquery'], function($) {

    $(document).ready(function() {
        var slideNav = new woodstream.TouchObj('slideNav', navHandler);
        var articleTitles = new woodstream.EqualHeight($('.sf-resource-wrap.articles .title'));
        var videoTitles = new woodstream.EqualHeight($('.sf-resource-wrap.videos .title'));
        var captionTitles = new woodstream.EqualHeight($('.solution-wrap .caption'));
    });

    var startPos, navLimit;
    var setNavLimit = function() { $('#slideNav').css({'left':0}); navLimit = parseInt((window.innerWidth - 20) - ($("#slideNav ul li:last-child").offset().left + $("#slideNav ul li:last-child").outerWidth())); }
    $(window).on('resize', setNavLimit);

    var nav = $('#slideNav');

    function navHandler(obj) {
        if (obj.status == 'start') { startPos = parseInt(nav.css('left')); }
        if (obj.status == "move") {
            if (navLimit <= 0) {
                var newLeft = startPos + obj.xMove;
                if (newLeft > 0) { newLeft = 0;  }
                if (newLeft < navLimit) { newLeft = navLimit; }
                nav.css({'left':newLeft});
            }
        }
    }

    var categorySelector = $('#categorySelector');
    if (categorySelector.length > 0) {
        categorySelector.on('change', function() {
            var target = $(this).val();
            window.location.href = target;
        });
    }

    // basic slider

    woodstream.ResourceSlider = function(el) {
        this.el = $('#' + el);
        this.prev = this.el.find('.controls .resource-prev');
        this.next = this.el.find('.controls .resource-next');
        this.wrap = this.el.find('.sf-resource-wrap');
        this.mask = this.el.find('.sf-slider-mask');
        this.controls = this.el.find('.controls');
        this.controlVisibility = this.el.attr('data-controls');
        this.controlsVisible = false;
        if (this.controlVisibility === undefined) { this.controlVisibility = 959; }

        var that = this;

        this.nextPanel = function() {
            var offset =  that.wrap.find('.inline-item:last-child').innerWidth();
            var item = that.wrap.find('.inline-item:first-child').clone(true);
            that.wrap.append(item).animate({'left':-1 * offset}, 250, function() {
                that.wrap.find('.inline-item:first-child').remove();
                that.wrap.css({'left':0});
                if (that.wrap.find('.inline-item:last-child .youtube-player div').length > 0) {
                    that.wrap.find('.inline-item:last-child .youtube-player div')[0].onclick = ytIframe;
                }
            });
        }

        this.prevPanel = function() {
            var offset =  that.wrap.find('.inline-item:last-child').innerWidth();
            var item = that.wrap.find('.inline-item:last-child').clone(true);
            that.wrap.css({'left':-1 * offset}).prepend(item).animate({'left':0}, 250, function() {
                that.wrap.find('.inline-item:last-child').remove();
                if (that.wrap.find('.inline-item:first-child .youtube-player div').length > 0) {
                    that.wrap.find('.inline-item:first-child .youtube-player div')[0].onclick = ytIframe;
                }
            });
        }

        this.checkControls = function() {
            var docWidth = window.innerWidth;
            if (this.controlsVisible && docWidth > this.controlVisibility) {
                this.controls.hide();
                this.prev.attr('aria-hidden', true);
                this.next.attr('aria-hidden', true);
                this.controlsVisible = false;
            } else if (!this.controlsVisible && docWidth <= this.controlVisibility) {
                this.controls.show();
                this.prev.attr('aria-hidden', false);
                this.next.attr('aria-hidden', false);
                this.controlsVisible = true;
            }
        }

        $(window).on('resize', function() { that.checkControls(); });

        $(document).ready(function() {
            that.checkControls();
            if (that.controlsVisible && el === 'solution-slider') {
                var activeIndex = $('#solution-slider .inline-item.active').index();
                if (activeIndex > 0) {
                    for (var i = activeIndex; i > 0; i--) {
                        $('#solution-slider .solution-wrap .inline-item:first-child').appendTo($('#solution-slider .solution-wrap'));
                    }
                }
            }
        });

        this.prev.on('click', that.prevPanel);
        this.next.on('click', that.nextPanel);

        this.touchHandler = function(obj) {
            var docWidth = window.innerWidth;
            if (docWidth < 960) {
                if (obj.status == 'end') {
                    if (obj.xMove > 80) { that.prevPanel(); }
                    if (obj.xMove < -80) { that.nextPanel(); }
                }
            }
        }
        $(document).ready(function() {
          that.touchEvent = new woodstream.TouchObj(el, that.touchHandler);
        });
    }

    $(document).ready(function() {
        if ($('#sf-video-slider').length > 0) { var sliderOne = new woodstream.ResourceSlider('sf-video-slider'); }
        if ($('#sf-resource-slider').length > 0) { var sliderTwo = new woodstream.ResourceSlider('sf-resource-slider'); }
        if ($('#solution-slider').length > 0) { var sliderThree = new woodstream.ResourceSlider('solution-slider'); }
    });

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    $(document).ready(function() {
        var track = getCookie('solutionTrack');
        if ($('#slideNav ul li:nth-child(2) a').length > 0) {
            $('#slideNav ul li:nth-child(2) a').attr('href',track);
        }
    });

//});