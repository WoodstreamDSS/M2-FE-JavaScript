// JavaScript Document

// equal height columns

(function($) {
    'use strict';

    var EqualHeight = function(id) {
        this.id = $(id);
        this.divs = this.id.find('> div');
        this.break = parseInt($(this.id).attr('data-break'));
        if (isNaN(this.break)) { this.break = 0; }
        this.adjustHeight = function() {
            var docWidth = window.innerWidth;
            this.divs.css({'height':'auto'});
            if (docWidth > this.break) {
                this.divs.css({'height':'auto'});
                var tempHeight = 0;
                var divHeight = 0;
                this.divs.each(function() {
                    divHeight = $(this).outerHeight();
                    if (divHeight > tempHeight) { tempHeight = divHeight; }
                });
                $(this.divs).css({'height':tempHeight});
            }
        };
        $(window).load(function() { this.adjustHeight(); }.bind(this));
        $(window).on('resize', function() { this.adjustHeight(); }.bind(this));
    };
    var EqualHeightCollection = $('.equal-height');
    var EqualHeightList = [];
    EqualHeightCollection.each(function(idx) { EqualHeightList[idx] = new EqualHeight(this); });
})(jQuery);

// expandable box

(function($) {
    'use strict';

    var ExpandBox = function(id, index) {

        // html code constants, using SVG here as proof of concept but could simply use +  and - characters.

        this.openControl = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 171 171" style="enable-background:new 0 0 171 171;" xml:space="preserve"><style type="text/css">.st0{fill:#FCFF08;}</style><g><circle cx="85.5" cy="85.5" r="85.5"/><polygon class="st0" points="85.5,126.7 128.4,52.3 42.6,52.3"/></g></svg>';
        this.closeControl = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 171 171" style="enable-background:new 0 0 171 171;" xml:space="preserve"><style type="text/css">.st0{fill:#FCFF08;}</style><g><circle cx="85.5" cy="85.5" r="85.5"/><polygon class="st0" points="85.5,44.3 42.6,118.7 128.4,118.7 	"/></g></svg>';
        var controlHtml = '<div class="expand-control">' + this.openControl + '</div>';

        // store link to expandbox object, add control object code to DOM element, set CSS to apply required attributes, include divs in tab order

        this.id = $(id);
        this.id.find('.title').prepend(controlHtml).attr('aria-controls', 'copy-' + index).css('cursor','pointer');
        this.id.find('.title').attr('tabIndex', 0).css('position','relative');
        this.id.find('.copy').attr({'aria-expanded':'false','aria-role':'region','id':'copy-' + index}).css({'height':0, 'overflow':'hidden'});

        // event listeners for keyboard and mouse

        this.id.find('.title').on('click', function(e) { this.activate(e); }.bind(this));
        this.id.find('.title').on('keyup', function(e) { if (e.which === 13 || e.which === 32) { $(this).click(); } });
    };

    ExpandBox.prototype.activate = function() {                    // click event handler
        var copy = this.id.find('.copy');
        var divHeight = copy.get(0).scrollHeight;
        var time = divHeight;
        if (copy.attr('aria-expanded') === 'false') {                   // close expandbox
            copy.attr('aria-expanded', 'true');
            copy.animate({height: divHeight}, time);
            this.id.find('.expand-control').html(this.closeControl);
        } else {                                                        // open expandbox
            copy.attr('aria-expanded', 'false');
            copy.animate({height: 0}, time);
            this.id.find('.expand-control').html(this.openControl);
        }
    };

    // collect all .expand-box items on the page and activate them all.

    var expandCollection = [];
    var expandList = $('.expand-box');
    expandList.each(function(index) { expandCollection[index] = new ExpandBox(this); });

})(jQuery);

// lc video tab controls, could probably make this more generic ... would probably need to populate aria tags instead of just assuming they're there. use an object. etc.

(function($) {
    'use strict';

    $('.lc-video-tabs ul li:nth-child(1)').attr('aria-selected',true).attr('aria-controls','articles');
    $('.lc-video-tabs ul li:nth-child(2)').attr('aria-selected',false).attr('aria-controls','videos');
    $('.lc-video-tabs ul li:nth-child(3)').attr('aria-selected',false).attr('aria-controls','rodent-library');
    $('.tab-content #articles').attr('aria-hidden',false);
    $('.tab-content #videos').attr('aria-hidden',true);
    $('.tab-content #rodent-library').attr('aria-hidden',true);

    $('.lc-video-tabs .tab-control li').on('click', function() {
        var state = $(this).attr('aria-selected');
        if (state === 'false') {
            $('.lc-video-tabs .tab-control li').attr('aria-selected',false);
            $(this).attr('aria-selected',true);
            var target = '#' + $(this).attr('aria-controls');
            $('.lc-video-tabs .tab-content .panel').attr('aria-hidden',true);
            $(target).attr('aria-hidden',false);
        }
    });
})(jQuery);

/*
// youtube video code (won't be necessary to include on production, it's already part of Magento)

(function() {

    'use strict';

    document.addEventListener("DOMContentLoaded",function() { var div, n, v = document.getElementsByClassName("youtube-player");
            for (n = 0; n < v.length; n++) {
                div = document.createElement("div");
                var dataID = v[n].getAttribute('data-id');
                div.setAttribute("data-id", dataID);
                div.innerHTML = ytThumb(dataID);
                div.onclick = ytIframe;
                v[n].appendChild(div);
            }
        });

    function ytThumb(id) {
        var thumb = '<img src="https://i.ytimg.com/vi/ID/hqdefault.jpg">',
            play = '<div class="play"></div>';
        return thumb.replace("ID", id) + play;
    }

    function ytIframe() {
        var iframe = document.createElement("iframe");
        var embed = "https://www.youtube.com/embed/ID?autoplay=1";
        var dataID = this.getAttribute('data-id');
        iframe.setAttribute("src", embed.replace("ID", dataID));
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("allowfullscreen", "1");
        this.parentNode.replaceChild(iframe, this);
    }

})();
*/

// subpage controls/mobile formatting

(function($) {
    'use strict';

    var mobile = false;
    $(window).on('load', function() {
        var docWidth = window.innerWidth;
        if (docWidth < 979) { mobile = true; mobileMode(); }
        var navLinks = $('.subpage-content .left-nav ul li a');
        var url = window.location.pathname;
        navLinks.each(function() {
            var target = $(this).attr('href');
            if (target === url) { $(this).addClass('active'); }
        });
    });
    $(window).on('resize', function() {
        var docWidth = window.innerWidth;
        if (docWidth < 979 && mobile === false) {
            mobileMode();
            mobile = true;
        } else if (docWidth > 979 && mobile === true) {
            desktopMode();
            mobile = false;
        }
    });
    $('.subpage-content .control').on('click', function() {
        var docWidth = window.innerWidth;
        if (docWidth < 979) { $('.subpage-content .hidden-content').toggle(); }
    });
    function mobileMode() {
        $('.left-content .lower-content').appendTo('.subpage-content').addClass('mobile');
        $('.left-content .nav-dropdown').prependTo('.left-nav');
        $('.left-content .upper-content .control').addClass('active');
        $('.subpage-content .hidden-content').hide();
    }
    function desktopMode() {
        $('.subpage-content .lower-content').appendTo('.left-content').removeClass('mobile');
        $('.left-nav .nav-dropdown').insertBefore('.upper-content .social-media-links');
        $('.left-content .upper-content .control').removeClass('active');
        $('.subpage-content .hidden-content').show();
    }

})(jQuery);

// social icons

(function($) {
    'use strict';

    var docTitle = encodeURIComponent(document.title);
    var pageUrl = encodeURIComponent(document.URL);
    var fbUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + pageUrl;
    $('.social-link.facebook').attr('href',fbUrl);
    var twUrl = 'https://twitter.com/intent/tweet?text=' + docTitle + '&url=' + pageUrl + '&related=';
    $('.vp-lc .social-link.twitter').attr('href',twUrl);
    var gpUrl = 'https://plus.google.com/share?url=' + pageUrl;
    $('.vp-lc .social-link.gplus').attr('href',gpUrl);
    var ptUrl = 'https://pinterest.com/pin/create/button/?url=&media=' + pageUrl + '&description=' + docTitle;
    $('.vp-lc .social-link.pinterest').attr('href',ptUrl);
    var mtUrl = 'mailto:?subject=' + docTitle + '&body=' + pageUrl;
    $('.vp-lc .social-link.email').attr('href',mtUrl);


    $('.vp-lc .social-link').on('click', function(e) {
        e.preventDefault();
        var link = $(this).attr('href');
        window.open(link, docTitle, "height=285,width=550,resizable=1");
    });

})(jQuery);
