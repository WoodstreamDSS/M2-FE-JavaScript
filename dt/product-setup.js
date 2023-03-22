require(['jquery'], function($) {
  const fnSwitchTab = function(t) {
    var tabIndex = t.getAttribute('data-tabidx');

    document.querySelector('.tab.inline-item.active').setAttribute('aria-selected', false);
    document.querySelector('.tab.inline-item.active').classList.remove('active');

    document.querySelector('.setup-steps .tab-content.active').setAttribute('aria-hidden', true);
    document.querySelector('.setup-steps .tab-content.active').classList.remove('active');

    document.querySelector('.tab.inline-item[data-tabidx="' + tabIndex + '"]').setAttribute('aria-selected', true);
    document.querySelector('.tab.inline-item[data-tabidx="' + tabIndex + '"]').classList.add('active');

    document.querySelectorAll('.setup-steps .tab-content')[parseInt(tabIndex)].setAttribute('aria-hidden', false);
    document.querySelectorAll('.setup-steps .tab-content')[parseInt(tabIndex)].classList.add('active');

    /*

      All we're doing here is setting the aria-hidden and aria-selected attributes to true or false. As a habit, I'll often still use "active" as a class to mark which element is currently active. But it's possible to just use the attributes instead. So you could replace your "active" class in your CSS with a reference to the aria attribute. So instead of saying:

        .setup-steps .tab-content.active { ... }

      you could say:

        .setup-steps .tab.content[aria-selected="true"] { ... }

    */

  }

  $(document).ready(function() {

    // check for a mouse click or user pressing space or return when element has focus

    $('.tab.inline-item').on('click', function() { fnSwitchTab(this); });
    $('.tab.inline-item').on('keyup', function(e) {
      if (e.which == 13 || e.which == 32) { fnSwitchTab(this); }
    });

    /*
    var tabs = document.querySelectorAll('.tab.inline-item');
    if (tabs != null && tabs.length > 0) {
      for (var i = 0; i < tabs.length; i++) {
        tabs[i].onclick = function(){
          fnSwitchTab(this);
        };
      }
    }*/

    var outdoorTraps = new woodstream.BlockSlider('outdoor-traps-slider');
    var indoorTraps = new woodstream.BlockSlider('indoor-traps-slider');
    var dot = new woodstream.BlockSlider('dot-slider');
    var flyLight = new woodstream.BlockSlider('flylight-slider');
    var dynaShield = new woodstream.BlockSlider('dynashield-slider');
    var dynaZap = new woodstream.BlockSlider('dynazap-slider');
  });
});