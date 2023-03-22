(function($) {
    
    $('.video-overlay .video-cta').on('click', function() {
        $('.header-video-modal .modal-item').fadeIn(250); 
    });
    $('.header-video-modal .video-screen').on('click', function() {
        $('.header-video-modal .modal-item').fadeOut(250); 
        var el_src = $('.header-video-modal iframe').attr("src");
        var newSrc = el_src.replace('autoplay=1', 'autoplay=0');        
        $('.header-video-modal iframe').attr("src",newSrc);
    });
    
})(jQuery);