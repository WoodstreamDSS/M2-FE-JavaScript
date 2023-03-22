require(['jquery'], function($) {

  let url = window.location.pathname;
  let link;
  url == '/morebirds' ? link = '/store/more-birds' : link = '/store/droll-yankees';
  $('#cb-notification a').attr('href', link);

  let cookie = woodstream.getCookie('cb-notification');

  if (cookie != 'true') {
    woodstream.modalControl('cb-notification', true);
    woodstream.setCookie('cb-notification', 'true', 30);
  }

  $('#cb-notification-close').on('click', () => {
    woodstream.modalControl('cb-notification', false);
  });

});