
require(['jquery'], function($) {

(function($) {
    'use strict';

    var startX, currentX, origin, newLeft, amtMoved;
    var target = $('#mobile-sliding-nav ul');

    var menuItem = function(idx, el) {
        this.idx = idx + 1; // css nth-child position, not array position
        this.id = el;
        this.parentWidth = parseInt(this.id.parent().parent().css('width'));
        this.leftEdge = -1 * this.id[0].offsetLeft;
        this.rightEdge = this.id[0].offsetLeft + this.id[0].offsetWidth;
        this.width = parseInt(this.id.css('width'));
        this.centerOffset = (this.leftEdge + (this.parentWidth / 2)) - (this.width / 2);
    };

    var SlideMenu = function(el) {
        var that = this;
        this.id = $(el);
        this.menu = $(el).find('ul');
        this.items = $(el).find('li');
        this.width = function() { return parseInt(this.id.css('width')); };

        this.itemList = []; // intialize variables
        this.leftOffset = 0;
        this.rightEdge = function() { return this.itemList[this.itemList.length - 1].rightEdge; };
        this.maxOffset = 0;

        this.init = function() { // initialize values
            this.itemList = [];
            this.items.each(function(index) {
                that.itemList.push(new menuItem(index, $(this)));
            });
            this.maxOffset = (-1 * this.rightEdge()) + this.width();
            this.menu.css({'left':0});
        }.bind(this);

        $(window).load(function() {
            that.init();
        });

        this.center = function(idx) {
            var offset = that.itemList[idx].centerOffset;
            that.setLeftOffset(offset);
            that.maxOffset = (-1 * that.rightEdge()) + that.width();
            if (that.maxOffset > 0) { that.maxOffset = 0; }
        };

        this.setLeftOffset = function(offset) {
            if (offset > 0) { offset = 0; }
            if (offset < that.maxOffset) { offset = that.maxOffset; }
            this.menu.animate({'left':offset});
        };

        var startX, currentX, origin, newLeft, amtMoved;

        $(this.menu)[0].addEventListener('touchstart', function(e) {
            startX = parseInt(e.changedTouches[0].pageX);
            origin = parseInt($(that.menu).css('left'));
            if (isNaN(origin)) { origin = 0; }
        });

        this.menu[0].addEventListener('touchmove', function(e) {
            currentX = parseInt(e.changedTouches[0].pageX);
            amtMoved = currentX - startX;
            newLeft = origin + amtMoved;

            if (newLeft > 0) {
                newLeft = 0;
                that.id.removeClass('pre');
            } else {
                that.id.addClass('pre');
            }

            if (newLeft < that.maxOffset) {
                newLeft = that.maxOffset;
                that.id.removeClass('post');
            } else {
                that.id.addClass('post');
            }
            if (newLeft > 0) { newLeft = 0; }
            $(that.menu).css({'left':newLeft});
        });

        $(window).on('resize', function () { that.init(); });

        $(this.menu)[0].addEventListener('touchend', function() {
            startX = 0;
        });
    };
    if ($('#mobile-sliding-nav').length > 0) {
        var menu = new SlideMenu('#mobile-sliding-nav');
    }

    // automate active marking in product library menu

    if ($('.pl-select').length > 0) {

        var plCat = $('.pl-select').attr('class').split(' ').pop();
        if (plCat === 'mouse') { $('#mobile-sliding-nav .product-library li:nth-child(1)').addClass('active'); }
        if (plCat === 'rat') { $('#mobile-sliding-nav .product-library li:nth-child(2)').addClass('active'); }
        if (plCat === 'mole') { $('#mobile-sliding-nav .product-library li:nth-child(3)').addClass('active'); }

        // pl dropdown handler

        var winLoc = window.location.pathname;
        var dropdown = $('.pl-select option');
        if (dropdown.length > 0) {
            dropdown.each(function() {
                var destination = $(this).val();
                if (destination.indexOf(winLoc) >= 0) {
                    $(this).attr('selected',true);
                }
            });
        }

        $('.pl-select').on('change', function() {
            var newPage = $(this).val();
            $('.unloading-anim').show();
            window.location.assign(newPage);
        });

    }

    // learn more handler

    if ($('.expand-content').length > 0) {
        $('.expand-content').on('click', function(e) {
            e.stopPropagation();
            var content = $(this).prev('.hidden-content');
            if (parseInt(content.css('height')) === 0) {
                var newHeight = content[0].scrollHeight;
                content.animate({'height':newHeight}, 200, function() {
                    content.css({'height':'auto'});
                });
            } else {
                content.animate({'height':0}, 200, function() {
                    var parentItem = $(this).closest('.inline-item');
                    var edges = parentItem[0].getBoundingClientRect();
                    var limit = window.innerHeight - 20;
                    if (edges.bottom < limit) {
                        parentItem.animate({'top':0});

//                        var offset = limit - edges.bottom;
//                        var currentOffset = parseInt(parentItem.css('top'));
//                        var newOffset = currentOffset + offset;
//                        parentItem.animate({'top':newOffset});
                    }
                });
            }
        });
    }

    if ($('.expand-simple').length > 0) {
        $('.expand-simple').on('click', function() {
            var content = $(this).next('.hidden-content');
            if (parseInt(content.css('height')) === 0) {
                var newHeight = content[0].scrollHeight;
                content.animate({'height':newHeight}, 200, function() {
                    content.css({'height':'auto'});
                });
            } else {
                content.animate({'height':0}, 200);
            }
        });
    }

    // article page index menu update

    $(window).load(function() {
        if ($('.app-page .article').length > 0) {
            var cat = $('.app-page').data('page-cat');
            $('#article-link li').each(function() {
                if ($(this).data('cat') === cat) {
                    $(this).addClass('active');
                    var idx = $(this).index();
                    menu.center(idx);
                }
            });
        }
    });

    $('#article-filter.know-more-index li').on('click', function() {
        $('#article-filter li').removeClass('active');
        $(this).addClass('active');
        var idx = $(this).index();
        var newCat = $(this).data('link');
        if (newCat === 'all') {
            $('[data-category]').css({'display':'inline-block'});
        } else {
            $('[data-category]').hide();
            $('[data-category="' + newCat + '"]').css({'display':'inline-block'});
        }
        menu.center(idx);
    });

    $(window).load(function() {
        if (window.location.hash) {
            var hash = window.location.hash.substring(1);

            $('#article-filter.know-more-index li').each(function() {
                if ($(this).data('link') === hash) {
                    $(this).addClass('active');
                    var idx = $(this).index();
                    menu.center(idx);
                    $('[data-category]').hide();
                    $('[data-category="' + hash + '"]').css({'display':'inline-block'});
                }
            });
        } else {
            $('#article-filter li:first-child').addClass('active');
        }
    });

})(jQuery);

(function($) {
    'use strict';

    var TwoAxisSlider = function(id) {
        this.id = id;
        this.offset = function() {
            var offsetAmount = parseInt($(id).find('.inline-item').outerWidth(true));
            return offsetAmount;
        };
        this.index = 0;
        this.maxIndex = ($(id).find('.inline-item').length) - 1;
        this.threshhold = Math.floor(this.offset() / 3);
        this.updateSlider = function(mode) {
            var animSpeed;
            if (mode === 0) { animSpeed = 0; } else { animSpeed = 100; }
            if (this.index < 0) { this.index = 0; }
            if (this.index > this.maxIndex) { this.index = this.maxIndex; }

            $('#article-filter li').removeClass('active');
            $('#article-filter li:nth-child(' + (this.index + 1) + ')').addClass('active');

            var newLeftPosition = -1 * (this.index * this.offset());

            $(this.id).find('.inline-wrap').animate({'left':newLeftPosition}, animSpeed);
        };

        this.checkBottom = function (el) {
            var elPos = el[0].getBoundingClientRect();
            var minPos = window.innerHeight - 20;
            if (elPos.bottom < minPos) { return false; } else { return true; }
        };

        // event listeners

        var startX, currentX, origin, amtMoved;
        var startY, currentY, yOrigin, yAmtMoved;
        var lock, lockX, lockY;

        $(this.id)[0].addEventListener('touchstart', function(e) {
            startX = parseInt(e.changedTouches[0].pageX);
            startY = parseInt(e.changedTouches[0].pageY);
            origin = parseInt($(this.id).find('.inline-wrap').css('left'));
            yOrigin = parseInt($(this.id).find('.inline-item:nth-child(' + (this.index + 1)  + ')').css('top'));
            if (isNaN(origin)) { origin = 0; }
            lock = false;
            lockX = false;
            lockY = false;
        }.bind(this));

        $(this.id)[0].addEventListener('touchmove', function(e) {
            var el = $(this.id).find('.inline-item:nth-child(' + (this.index + 1)  + ')');
            currentX = parseInt(e.changedTouches[0].pageX);
            currentY = parseInt(e.changedTouches[0].pageY);
            amtMoved = currentX - startX;
            yAmtMoved = currentY - startY;
            if (Math.abs(yAmtMoved) > 20 && lock === false) { lock = true; lockY = true; lockX = false; }
            if (Math.abs(amtMoved) > 20 && lock === false) { lock = true; lockX = true; lockY = false; }
            var newTop = yOrigin + yAmtMoved;
            var test = this.checkBottom(el);
            if ($(this.id).find('.inline-item').length > 1 && (origin + amtMoved) < 0) {
                if (lock === false || lockX === true) {
                    $(this.id).find('.inline-wrap').css({'left':origin + amtMoved});
                }
            }
            if (newTop > 0) { newTop = 0; }

            if (lock === false || lockY === true) {
                if (test) {
                    el.css({'top':newTop});
                } else {
                    if (yAmtMoved > 0) { el.css({'top':newTop}); }
                }
            }
        }.bind(this));

        $(this.id)[0].addEventListener('touchend', function() {
            if (amtMoved > this.threshhold) { this.index--; $(this.id).find('.inline-item').animate({'top':0}, 200);}
            if (amtMoved < -1 * this.threshhold) { this.index++; $(this.id).find('.inline-item').animate({'top':0}, 200); }
            this.updateSlider();
            amtMoved = 0;
        }.bind(this));
        $(window).on('resize', function() { this.updateSlider(0); }.bind(this));
    };

    if ($('.app-page.page-fixed').length > 0) { $('body').css({'overflow':'hidden'}); }

    if ($('#two-axis-slider').length > 0) {
        var slider = new TwoAxisSlider('#two-axis-slider');
    }

})(jQuery);

(function($) {
    $(document).ready(function () {
        var pestBackButton = document.createElement('div');
        pestBackButton.setAttribute('id','pest-library-home-nav');
        var pestLink = document.createElement('a');
        pestLink.setAttribute('href','/victor-app/pest-library');
        var pestImg = document.createElement('img');
        pestImg.setAttribute('src','/media/wysiwyg/vp/app/vp-app-back-button-float.png');
        pestImg.setAttribute('alt','back');
        pestLink.appendChild(pestImg);
        pestBackButton.appendChild(pestLink);
        if (window.location.href.indexOf('pest-library/') > -1) {
            $('.app-page').append(pestBackButton);
        }
    });
})(jQuery);

(function($) {
    var unload = document.createElement('div');
    unload.setAttribute('class','unloading-anim');
    var unloadImg = document.createElement('img');
    unloadImg.setAttribute('src','/media/wysiwyg/vp/app/vp-app-loading-spinner-2.gif');
    unloadImg.setAttribute('style','width:100%; height:auto');
    unloadImg.setAttribute('alt','loading');
    unload.appendChild(unloadImg);
    $('body').append(unload);
    $('.app-page:not(.solution-finder, .pl-wtb) a').on('click', function(e) {
        $('.unloading-anim').show();
    });

})(jQuery);

});