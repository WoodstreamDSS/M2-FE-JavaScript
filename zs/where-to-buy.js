require(['jquery'], function($) {

  function tabHeight() {
    let docWidth = window.innerWidth;
    if (docWidth > 575) {
      $('.tab-item').css({'height':'auto'});
      let wrapHeight = $('.tab-wrap').outerHeight();
      $('.tab-item').css({'height':wrapHeight + 'px'});
    } else {
      $('.tab-item').css({'height':'auto'});
    }
  }

  $("select.list").on("change", function() {
    let selector;
    let value = $(this).val();
    let tabSection = $(this).attr("id");
    if (tabSection == "international-list") { selector = ".tab-panel .international-panel .unit"; }
    if (tabSection == "service-list") { selector = ".tab-panel .service-panel .unit"; }
    $(selector).hide();
    value == "ALL" ? $(selector).show() : $(selector + "." + value).show();
  });

  $(".where-to-buy .tab-item").on("click", function() {
    let newPanel = ".tab-panel." + $(this).attr("data-id");
    $(".tab-item").removeClass("active");
    $(this).addClass("active");
    $(".tab-panel").hide();
    $(newPanel).show();
  })

  tabHeight();

  $(window).on('resize', function() { tabHeight(); });
  if (window.location.hash) {
    let hash = window.location.hash.substring(1);
    if (hash === 'service') { jQuery('.tab-wrap .tab-item[data-id="service"]').click(); }
  }

});