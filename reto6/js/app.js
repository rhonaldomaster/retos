var reto6 = (function () {
  var init = function () {
    var items = document.querySelectorAll('.js-stack-item');
    for (var i = 0; i < items.length; i++) {
      items[i].addEventListener('change',hideItem,false);
    }
  };

  var hideItem = function (ev) {
    var element = ev.currentTarget;
    var parent = element.parentNode;
    parent.classList.add('stack__item--hidden');
    /*setTimeout(function () {
      parent.classList.add('hidden');
    },1500);*/
  };

  return {
    init: init
  };
})();

reto6.init();
