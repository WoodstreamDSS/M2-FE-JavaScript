(function($) {
  var panelCollection = $('.planner-panel');
  var panelHeightControl = new woodstream.EqualHeight(panelCollection);

  var maxPanels = panelCollection.length - 1;
  var currentPanel = 0;

  $('.vlink-planner').on('keydown', function(e) {
    if (e.which === 37) {
      var newPanel = currentPanel - 1;
      var panelAvailable = checkPanel(newPanel);
      if (panelAvailable) { prevPanel(); }
    }
    if (e.which === 39) {
      var newPanel = currentPanel + 1;
      var panelAvailable = checkPanel(newPanel);
      if (panelAvailable) { nextPanel(); }
    }
  });

  var prevPanel = function() {
    currentPanel--;
  }

  var nextPanel = function() {
    currentPanel++;
  }

})(jQuery);