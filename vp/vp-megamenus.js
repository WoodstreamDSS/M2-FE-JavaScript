
woodstream.MobileMenuList = class {
  constructor(id) {
    this.id = id;
    this.el = $(`#${this.id}`);
    this.controller = $(`.list-header[data-target="${this.id}"]`);
    this.controller.on('click', (e) => {
      if (this.mobile) { this.clickHandler(e); };
    });
    this.mobile = false;

    this.updateDocumentState();
    $(window).on('resize', () => { this.updateDocumentState(); });

    this.init();
  }

  updateDocumentState() {
    if (window.innerWidth < 767) { this.mobile = true; }
  }

  init() {
    this.el.find('a').attr({'tabindex':-1});
    $(`.list-header[data-target="${this.id}"]>a`).attr({'tabindex':0});

    $(`#${this.id}>li`).attr({'role':'treeitem'});
    let parentList = this.el.parents('.mobile-menu-list');
    if (parentList.length == 0) {
      this.el.attr({'role':'tree', 'data-level':parentList.length});
    } else {
      this.el.attr({'role':'group', 'data-level':parentList.length});
    }

    let arrowContainer = document.createElement('div');

    let tabState;
    this.mobile ? tabState = 0 : this.tabState = -1;
    $(arrowContainer).attr({'class':'mobile-arrow', 'tabindex':tabState});
    $(this.controller).append(arrowContainer);

  }

  clickHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    if ($(this.el).hasClass('open')) {
      this.controller.removeClass('open');
      $(this.el).attr('aria-expanded', 'false').removeClass('open');
      $(this.el).find('a').attr('tabindex', -1);
    } else {
      this.controller.addClass('open');
      $(this.el).attr('aria-expanded', 'true').addClass('open');
      $(this.el).find('a').attr('tabindex', 0);
    }
  }
}

let megamenuControls = $('.mobile-menu-list');
let megamenuCollection = [];
megamenuControls.each(function() {
  megamenuCollection.push(new woodstream.MobileMenuList($(this).attr('id')));
});
