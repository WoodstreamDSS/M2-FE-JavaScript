console.log('Project.js loaded');

(function($) {
  $('#youtube-mutate').on('click', function() {
    var newID;
    var currentID = $('.youtube-player.mutate').attr('data-id');
    if (currentID === '4Npygp51FQc') { newID = 'Y3f8che5JQI'; } else { newID = '4Npygp51FQc'; }
    $('.youtube-player.mutate').attr('data-id', newID);
  })

})(jQuery);