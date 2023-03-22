require(['jquery'], function($) {
  let block = $('.article-enews-signup.sticky-block');

  let cutoff = 30;
  let defaultTop;

  const checkBoxPosition = () => {
    let scrollTop = $(window).scrollTop();
    let sticky = scrollTop > (defaultTop - cutoff);
    if (sticky) {
      let offset = defaultTop + (scrollTop - defaultTop) + cutoff;
      block.offset({'top':offset});
    } else {
      block.offset({'top':defaultTop});
    }
  }

  const setDefaultPosition = () => {
    block.css({'position':'static'});
    defaultTop = block.offset().top;
    block.css({'position':'relative'});
    checkBoxPosition();
  }

  setDefaultPosition();
  checkBoxPosition();

  $(window).on('resize', () => { setDefaultPosition(); })
  $(window).on('scroll', () => { checkBoxPosition(); });
});