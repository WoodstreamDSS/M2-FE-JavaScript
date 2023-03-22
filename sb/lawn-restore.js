
require(['jquery'], function($) {

 $('.regions map area').on('click', function(e) {
        e.preventDefault();
        var region = '#' + $(this).attr('title');
        $(region).fadeIn(250);
        $('.lc-modal-screen').fadeIn(250);
    });

    $('.lc-modal-close, .lc-modal-screen').on('click', function() { $('.modal-item').fadeOut(250); });

    $('.modal-open').on('click', function() {
        var classList = $(this).attr('class').split(/\s+/);
        console.log(classList);
        var region ='#' + classList[classList.length - 1];
        $(region).fadeIn(250);
        $('.lc-modal-screen').fadeIn(250);
    });

    var ResponsiveImageMap = function(map, img) {
        this.img = img;
        this.map = map;
        this.naturalWidth = this.img.naturalWidth;
        this.areas = this.map.getElementsByTagName('area');
        this.coords = [];
        this.newCoords = [];
        this.currentWidth = function() {
            return img.clientWidth;
        }
        this.factor = 1;

        // populate original coordinates

        len = this.areas.length;
        for (var n = 0; n < len; n++) {
            this.coords[n] = this.areas[n].coords.split(',');
        }

        // resize coordinates

        this.resize = function() {
            this.factor = this.currentWidth() / this.naturalWidth;
            this.newCoords = [];
            for (n = 0; n < this.coords.length; n++) {
                this.newCoords.push([]);
                for (x = 0; x < this.coords[n].length; x++) {
                    this.newCoords[n][x] = this.coords[n][x] * this.factor;
                }
                this.areas[n].coords = this.newCoords[n].join(',');
            }
        }
        window.addEventListener('resize', function() { this.resize(); }.bind(this));
        this.resize();
    }

    $(window).on('load', function() {
        var imgMap = new ResponsiveImageMap(document.getElementById('map_ID'), document.getElementById('img_ID'));
    });

var customerSlider = new woodstream.BlockSlider('customer-slider');

});
