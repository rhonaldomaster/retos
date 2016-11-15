var reto5 = (function () {
  var days;
  var init = function () {
    days = document.querySelectorAll('.day-wheater');
    var list = document.querySelector('.js-day-selector');
    var checkboxes = list.querySelectorAll('input[type=checkbox]');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].addEventListener('change',toggleDay,false);
    }
  };

  var toggleDay = function (ev) {
    var checkbox = ev.currentTarget;
    var index = checkbox.dataset.index - 1;
    if(checkbox.checked) {
      days[index].style.display = 'block';
    }
    else {
      days[index].style.display = 'none';
    }
  };

  return {
    init: init
  }
})();

reto5.init();
