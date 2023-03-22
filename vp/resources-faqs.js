console.log('Project.js loaded');

var jumpNav = $('.ws-simple-tabs section.panel:visible .jump-nav');
var sticky = jumpNav.offset().top;

var fnStickyBar = function () {
  jumpNav = $('.ws-simple-tabs section.panel:visible .jump-nav');
  sticky = jumpNav.offset().top;
}

$(document).ready(function() {
  $('nav.main-nav button').click(fnStickyBar);

  $(document).on('click', 'a[href^="#"]', function(e){
    var id = $(this).attr('href');
    console.log('ID is ' + id);
    e.preventDefault();
    $('body, html').animate({scrollTop: $(id).offset().top - 70});
  });

  $('nav.jump-nav ul li.scroll').click( function(){
    $('body, html').animate({scrollTop: "0"});
  })

});

window.onscroll = function() {
  if (window.pageYOffset > sticky) {
    jumpNav.addClass("sticky");
  } else {
  jumpNav.removeClass("sticky");
  }
};
