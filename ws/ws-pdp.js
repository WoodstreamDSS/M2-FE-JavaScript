woodstream.ComparisonModule = function(el) {
  this.el = $(el);
  this.table = this.el.find('table');
  this.body = this.el.find('tbody');
  this.head = this.el.find('thead');
  this.foot = this.el.find('tfoot');
  this.data = this.body.find('td');
  this.colWidth = 0;
  this.leftConstraint;
  this.rightConstraint;
  this.overflow = false;
  this.touchObj = null;
  this.newPosition;
  this.startPosition;

  this.columnCount = this.body.find('tr:first-child').find('th,td').length;

  this.setTitleWidth = function(columns) {
    if (!columns) { columns = this.columnCount; }
    this.head.find('th').attr('colspan',columns);
    this.foot.find('td').attr('colspan',columns);
  }

  this.setColumnWidth = function() {
    var maxProducts = this.getMaxProducts();
    var maxColumns = maxProducts + 1;
    if (this.columnCount - 1 > maxProducts) {
      this.setTitleWidth(maxColumns + 1);
      this.overflow = true;
      this.el.find('.table-mask').addClass('overflow');
      var newColWidth = this.el.innerWidth() / (maxColumns + 0.5);
      var newTableWidth = this.columnCount * newColWidth;
      this.el.find('table').css('width',newTableWidth);
      this.body.find('th,td').css('width',newColWidth);
      this.columnWidth = newColWidth;
    } else {
      this.overflow = false;
      this.setTitleWidth(this.columnCount);
      var newColWidth = (100 / this.columnCount) + '%';
      console.log(newColWidth)
      this.body.find('th,td').css('width',newColWidth);
      this.el.find('table').css('width','100%');
      this.el.find('.table-mask').removeClass('overflow');
    }
  }

  this.getMaxProducts = function() {
    var maxProducts;
    var tableWidth = this.el.innerWidth();

    if (tableWidth < 480) { maxProducts = 1; }
    if (tableWidth > 479) { maxProducts = 2; }
    if (tableWidth > 767) { maxProducts = 3; }
    if (tableWidth > 979) { maxProducts = 4; }

    return maxProducts;
  }

  this.setConstraints = function() {
    this.rightConstraint = this.colWidth;
    this.leftConstraint = -1 * (this.table.innerWidth() - this.el.innerWidth());
  }

  this.resizeHandler = function() {
    this.setColumnWidth();
    this.setConstraints();
    this.startPosition = 0;
    this.data.css('left', this.startPosition);
  }

  this.touchHandler = function(obj) {
    if (this.overflow) {
      if (obj.status == 'start') {
        this.startPosition = parseInt(this.data.css('left'));
      }
      if (obj.status == 'move') {
        this.newPosition = this.startPosition + obj.xMove;
        if (this.newPosition > this.rightConstraint) { this.newPosition = this.rightConstraint; };
        if (this.newPosition < this.leftConstraint) { this.newPosition = this.leftConstraint; };
        this.data.css('left',this.newPosition);
        if (this.newPosition == this.leftConstraint) {
          this.el.find('.table-mask').removeClass('overflow');
        } else {
          this.el.find('.table-mask').addClass('overflow');
        }
      }
    }
  }.bind(this);

  this.init = function() {
    this.setTitleWidth();
    this.setColumnWidth();
    this.setConstraints();

    if (woodstream.TouchObj) {
      var id = this.el.attr('id');
      this.touchObj = new woodstream.TouchObj(id, this.touchHandler);
    };

    $(window).on('resize', function() { this.resizeHandler(); }.bind(this));

  }
  this.init();
}
woodstream.ComparisonModulesInit = function() {
  var compModules = $('.pdp-module.comparison-module');
  var compModulesCollection = [];

  if (compModules.length > 0) {
    compModules.each(function(i) {
      $(this).attr('id','id' + i);
      compModulesCollection.push(new woodstream.ComparisonModule(this));
    });
  }
  var switcher = $('.swatch-attribute-options');
  if (switcher.length > 0) {
    switcher.on('change', function() {
      woodstream.ComparisonModulesInit();
    }.bind(this));
  }
}
woodstream.ComparisonModulesInit();

$('.open-specs-tab').on('click', function(e) {
  e.preventDefault();
  let specs = document.getElementById('tab-label-specs.tab-title');
  $(specs).trigger('click');
});

$('.open-reviews-tab').on('click', function(e) {
  e.preventDefault();
  let reviews = document.getElementById('tab-label-product_aw_reviews_tab-title');
  $(reviews).trigger('click');
});