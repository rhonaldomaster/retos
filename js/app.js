var app = (function () {
  var init = function () {
    setSliderControlEvents();
  };

  var setSliderControlEvents = function () {
    var horizontalControls = document.querySelectorAll('.js-slide-control');
    for (var i = 0; i < horizontalControls.length; i++) {
      horizontalControls[i].addEventListener('click',scrollSlidesContainer,false);
    }
  };

  var scrollSlidesContainer = function (ev) {
    ev.preventDefault();
    var element = ev.currentTarget;
    var scrollDirection = element.dataset.direction;
    var scrollQuantity = 250;
    var movingFrequency = 15;
    /*var $slider = $('.js-slider');
    if (scrollDirection == 'left') $slider.animate({scrollLeft: "-="+scrollQuantity});
    else $slider.animate({scrollLeft: "+="+scrollQuantity});*/
    var slider = document.querySelector('.js-slider');
    if (scrollDirection == 'left') scrollQuantity *= -1;
    var hops = 15;
    var hopLenght = scrollQuantity/hops;
    for (var i = 0; i < hops; i++) {
      setTimeout(function(){
        slider.scrollLeft += hopLenght;
      }, movingFrequency*i);
    }
  };

  return {
    init: init
  };
})();

app.init();
