$(function (){
  $('.slideShow').each(()=>{
    var slides = $(this).find('.ly_jumbotoron');
    var slidelength = slides.length;
    var currentIndex = 0;
    var duration = 3500
    var timer = '';

    slides.eq(currentIndex).fadeIn();

    $('.slideShow').on({
      mouseenter:stopTimer,
      mouseleave:startTimer
    })

    $('.ly_jumbotoron').on('click',function(e){
      showNextSlide();
    })

    function startTimer(){
      timer = setInterval(showNextSlide,duration);
    }

    function stopTimer(){
      clearInterval(timer)
    }

    function showNextSlide(){
      var nextIndex = (currentIndex + 1) % slidelength;
      slides.eq(currentIndex).css('display','none')
      slides.eq(nextIndex).fadeIn();
      currentIndex = nextIndex;
    }
  })

  $('.ly_footer_inner').each(()=>{
    var el = scrollableElement('html','body')
    $('.ly_footer_inner').on('click',()=>{
      $(el).animate({scrollTop:0},250)
    })
  })

  $('.ly_footer_inner_top').each(()=>{
    var el = scrollableElement('html','body')
    $('.ly_footer_inner_top').on('click',()=>{
      $(el).animate({scrollTop:0})
    })
  })

  $('.ly_footer_inner_contentTop').each(()=>{
    var el = scrollableElement('html','body')
    var width = parseInt($(window).width());
    console.log(width)
    $('.ly_footer_inner_contentTop').on('click',()=>{
      if(width>=1004){
      $(el).animate({scrollTop:1200})
      } else if(width<1004 && width>=780){
      $(el).animate({scrollTop:1080})
      } else if(width<780) {
      $(el).animate({scrollTop:1040})
      }
    })

  })

  function scrollableElement(){
    var i, len, el, $el, scrollable;
    for(i=0, len = arguments.length; i<len; i++){
      el = arguments[i];
      $el = $(el);
      if($el.scrollTop() > 0){
        return el
      } else {
        $el.scrollTop(1);
        scrollable = $el.scrollTop() > 0;
        $el.scrollTop(0);
        if(scrollable){
          return el;
        }
      }
    }
  }
})