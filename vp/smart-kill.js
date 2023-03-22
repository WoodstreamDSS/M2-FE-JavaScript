require(['jquery'], function($) {

    "use strict";

    var Slider = function(id) {
        var that = this;
        this.tmpIdx = 0;
        this.animationSpeed = 300;
        this.id = id;
        this.index = 0;
        this.count = $(this.id).find('.panel').length;
        this.prevSlide = function(speed) {
            if (speed === undefined) { speed = this.animationSpeed; }
            var visible = that.visibleItems();
            var target = $(that.id).find('.panel-wrap');
            $(that.id).find('.panel-wrap').css({'left':-1 * (visible * that.itemWidth())});
            $(that.id).find('.panel').slice(-1 * visible).clone().prependTo(target);

            $(that.id).find('.panel-wrap').animate({'left':0}, speed, function() {
                $(that.id).find('.panel').slice(-1 * visible).remove();
            });
            $(that.id).find('.panel').attr('aria-hidden', true);
            $(that.id).find('.panel:first-child').attr('aria-hidden', false);
            this.index --;
            if (this.index < 0) { this.index = this.count - 1; }
            this.updateNav(this.index);
        };
        this.nextSlide = function(speed) {
            if (speed === undefined) { speed = this.animationSpeed; }
            var count = that.visibleItems();
            var target = $(that.id).find('.panel-wrap');
            $(that.id).find('.panel').slice(0,count).clone().appendTo(target);
            $(that.id).find('.panel-wrap').animate({'left':-1 * (count * that.itemWidth())}, speed, function() {
                $(that.id).find('.panel').slice(0,count).remove();
                $(that.id).find('.panel-wrap').css({'left':0});
                $(that.id).find('.panel').attr('aria-hidden', true);
                $(that.id).find('.panel:first-child').attr('aria-hidden', false);
            });
            this.index ++;
            if (this.index >= this.count) { this.index = 0; }
            this.updateNav(this.index);
        };
        this.clickActive = function() {
            $(that.id).find('.panel[aria-hidden="false"] a')[0].click();
        };
        $(this.id).find('.ctrl.right').on('click', function() {
            var target = $(that.id).find('.panel-wrap');
            if (!target.is(':animated')) { that.nextSlide(); }
        });
        $(this.id).find('.ctrl.left').on('click', function() {
            var target = $(that.id).find('.panel-wrap');
            if (!target.is(':animated')) { that.prevSlide(); }
        });

        this.updateNav = function(index) {
            $(this.id).find('.nav-circle').removeClass('active');
            $(this.id).find('.nav-circle[data-index="' + index + '"]').addClass('active');
        };

        // create nav circles

        var circleHtml = '<div class="slider-nav">';
        for (var i = 0; i < this.count; i++) {
            circleHtml += '<div class="nav-circle" data-index="' + i + '">&nbsp;</div>';
        }
        circleHtml += '</div>';
        $(this.id).append(circleHtml);
        $(this.id).find('.nav-circle:first-child').addClass('active');

        $(this.id).find('.nav-circle').on('click', function() {
            var newIndex = parseInt($(this).attr('data-index'));
            that.directNav(newIndex);
        });

        this.directNav = function(newIndex) {
            if (this.index < newIndex) { // we're going to hit the next button a few times.
                while (this.index < newIndex) {
                    this.nextSlide(0);
                }
            }
            if (this.index > newIndex) { // we're going to hit the prev button a few times.
                while (this.index > newIndex) {
                    this.prevSlide(0);
                }
            }
        };

        var startX, endX;

        $(this.id)[0].addEventListener('touchstart', function(e) {
            startX = parseInt(e.changedTouches[0].pageX);
        });
        $(this.id)[0].addEventListener('touchend', function(e) {
            endX = parseInt(e.changedTouches[0].pageX);
            var xMove = startX - endX;
            if (xMove > 30 || xMove < -30) {
                if (xMove > 0) { $(that.id).find('.ctrl.right').trigger('click'); } else { $(that.id).find('.ctrl.left').trigger('click'); }
            }
        });
        $(this.id).on('keyup', function(e) {
            var target = $(that.id).find('.panel-wrap');
            if (!target.is(':animated')) {
                switch(e.which) {
                    case 37: that.prevSlide(); break;
                    case 39: that.nextSlide(); break;
                    case 13: that.clickActive(); break;
                }
            }
        });


        $(window).on('resize', function() { that.setMaskWidth(); });
        this.setMaskWidth();
    };
    Slider.prototype.itemWidth = function() {
        var slideWidth = $(this.id).find('.panel').outerWidth(true);
        return slideWidth;
    };
    Slider.prototype.containerWidth = function() {
        return $(this.id).innerWidth();
    };
    Slider.prototype.navWidth = function() {
        return $(this.id).find('.ctrl').innerWidth();
    };
    Slider.prototype.maxMaskWidth = function() {
        var maskWidth = (this.containerWidth() - (2 * this.navWidth()));
        return maskWidth;
    };
    Slider.prototype.visibleItems = function() {
        var items = Math.floor(this.maxMaskWidth() / this.itemWidth());
        if (items < 1) { items = 1; }
        return items;
    };
    Slider.prototype.setMaskWidth = function() {
        var maskWidth = this.visibleItems() * this.itemWidth();
        $(this.id).find('.slider-mask').css({'width':maskWidth + 'px'});
        if (this.count > this.visibleItems()) { $(this.id).find('.ctrl').show(); } else { $(this.id).find('.ctrl').hide(); }
    };
    Slider.prototype.setItemWidth = function() {
        $(this.id).find('.panel').css({'width':this.itemWidth()});
    };

    var sliderList = $('.slider:not(".ignore")');
    var sliderArray = [];
    sliderList.each(function(index) {
        var id = $('#' + $(this).attr('id'));
        sliderArray[index] = new Slider(id);
    });

    var startX, currentX, origin, newLeft, amtMoved;
    var mouseDown = false;
    var target = $('.sk-compare-table table');
    var maxLeft = (-1 * (parseInt(target.innerWidth()) - window.innerWidth)) - 20;

    target[0].addEventListener('touchstart', function(e) {
        var maxLeft = -1 * (parseInt(target.innerWidth()) - window.innerWidth);
        startX = parseInt(e.changedTouches[0].pageX);
        origin = parseInt(target.css('left'));
        if (isNaN(origin)) { origin = 0; }
    });

    target[0].addEventListener('touchmove', function(e) {
        currentX = parseInt(e.changedTouches[0].pageX);
        amtMoved = currentX - startX;
        newLeft = origin + amtMoved
        slideTable(newLeft);
    });

    target[0].addEventListener('mousedown', function(e) {
        startX = parseInt(e.clientX);
        mouseDown = true;
        origin = parseInt(target.css('left'));
    });

    target[0].addEventListener('mousemove', function(e) {
        if (mouseDown === true) {
            currentX = parseInt(e.clientX);
            amtMoved = currentX - startX;
            newLeft = origin + amtMoved
            slideTable(newLeft);
        }
    });

    target[0].addEventListener('mouseup', function(e) {
        startX = 0;
        mouseDown = false;
    });

    function slideTable(newLeft) {
        if (newLeft > 0) {
            newLeft = 0;
        }
        if (newLeft < maxLeft) {
            newLeft = maxLeft;
        }
        if (window.innerWidth <= 480) {
            $(target).css({'left':newLeft});
        }
    }

    $(window).resize(function() {
        maxLeft = (-1 * (parseInt(target.innerWidth()) - window.innerWidth)) - 20;
        $(target).css({'left':0});
    });


    $('.modal-activate').on('click', function() {
    var modalId = $(this).attr('data-id');
    var contentEl = '.sk-modal-content-' + modalId;
    $('.sk-modal-item').fadeIn(250);
    $(contentEl).fadeIn(250);
    $('.youtube-player iframe')[0].src = "https://www.youtube.com/embed/Q-vrExtndlU";
    });

    $('.sk-modal-screen, .sk-modal-close').on('click', function() {
    if ($('youtube-player iframe').length > 0) {
    $('.youtube-player iframe')[0].src = "";
    }
    $('.sk-modal-item').fadeOut(250);
    $('.modal-content').fadeOut(250);
    });

});