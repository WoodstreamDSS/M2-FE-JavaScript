
require(['jquery'], function() {

  let units = $('.service-list .unit');
  $('#service-list').on('change', function() {
    let newFilter = $(this).val();
    if (newFilter == 'ALL') {
      units.show();
    } else {
      units.each(function() {
        $(this).attr('data-filter') == newFilter ? $(this).show() : $(this).hide();
      });
    }
  });

});