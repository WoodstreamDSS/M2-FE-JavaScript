// Pass the function a jQuery selector of elements. All elements will be kept the same height. A breakpoint can be added below which the elements will revert to height 'auto'. Breakpoint is zero by default.

WS.prototype.EqualHeight = function(collection, breakpoint) {
    this.collection = collection;
    this.breakpoint = breakpoint;
    if (this.breakpoint === undefined) { this.breakpoint = 0; }
    that = this;
    this.setHeight = function() {
        var docWidth = window.innerWidth;
        if (docWidth > this.breakpoint) {
            var newHeight = 0;
            this.collection.css({'height':'auto'});
            this.collection.each(function() {
                var elementHeight = parseInt($(this)[0].scrollHeight);
                if (elementHeight > newHeight) { newHeight = elementHeight; }
            });
            this.collection.css({'height':newHeight});
        } else {
            this.collection.css({'height':'auto'});
        }
    }
    $(window).on('resize', function() {
        that.setHeight();
    });
    this.setHeight();
}
