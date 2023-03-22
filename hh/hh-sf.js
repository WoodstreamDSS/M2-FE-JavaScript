require(['jquery'], function($) {

var wsjs = {};

  // equal height columns

  wsjs.EqualHeight = function(el, breakpoint, eqMode) {
    this.el = el;

    if (eqMode) {
      this.set = this.el;
    } else {
      this.set = this.el.find('> div');
    }

    if (breakpoint === undefined) {
      this.breakpoint = 960;
    } else {
      this.breakpoint = breakpoint;
    }

    this.setHeight = function() {
      $(this.set).css({'height':'auto'});
      if (window.innerWidth >= this.breakpoint) {
        maxHeight = 0;
        this.set.each(function() {
          var itemHeight = $(this)[0].scrollHeight;
          if (itemHeight > maxHeight) { maxHeight = itemHeight; }
        });
        this.set.each(function() {
          $(this).css({'height':maxHeight});
        });
      } else {
        $(this.set).css({'height':'auto'});
      }
    }
    $(window).on('resize', function() { this.setHeight(); }.bind(this));
  }

  var EqualHeightCollection = []
  $('.equal-height').each(function() {
    var newEqualHeight = new wsjs.EqualHeight($(this));
    EqualHeightCollection.push(newEqualHeight);
  });

  $(window).load(function() {
    EqualHeightCollection.forEach(function(item) {
      item.setHeight();
    });
    var problemEq = new wsjs.EqualHeight($('.problem .eq'), 480, true);
    problemEq.setHeight();
  });

  $('.numbered-expand .inline-item .control-content').on('click', function() {
    if (window.innerWidth <= 960) {
      var par = $(this);
      var el = $(this).parent('.inline-item').find('.mobile-content');

      if (parseInt(el.css('height')) === 0) {
        var newHeight = el[0].scrollHeight;
        $(el).animate({'height':newHeight}, 250, function() {
          $(el).css({'height':'auto'});
          $(par).removeClass('closed').addClass('open');
        });
      } else {
        $(el).animate({'height':0}, 250, function() {
          $(par).removeClass('open').addClass('closed');
        });
      }
    }
  });

});