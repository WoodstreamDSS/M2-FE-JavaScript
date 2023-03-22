require(['jquery'], function($) {
  const fnSwitchTab = function(t) {
    var tabIndex = t.getAttribute('tab-index');
    document.querySelector('.tab.inline-item.active').classList.remove('active');
    document.querySelector('.tab-content.active').classList.remove('active');
    document.querySelector('.tab.inline-item[tab-index="' + tabIndex + '"]').classList.add('active');
    document.querySelectorAll('.tab-content')[parseInt(tabIndex)].classList.add('active');
    document.querySelector('.advice-how .advice-header .heading-copy.active').classList.remove('active');
      document.querySelector('.advice-how .advice-header .heading-copy[tab-index="' + tabIndex + '"]').classList.add('active');
  }

  $(document).ready(function() {
    var tabs = document.querySelectorAll('.tab.inline-item');
    if (tabs != null && tabs.length > 0) {
      for (var i = 0; i < tabs.length; i++) {
        tabs[i].onclick = function(){
          fnSwitchTab(this);
        };
      }
    }
    let hash = window.location.hash;
    if (hash) {
      if (hash == '#dynashield') { $('.tab.dynashield').trigger('click'); }
      // if (hash == '#dynazap') { $('.tab.dynazap').trigger('click');
    }
  });
});