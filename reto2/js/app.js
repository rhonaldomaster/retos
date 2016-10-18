'use strict';
var app = (function () {
  var req = null;
  function contentLoader(url) {
    if(window.XMLHttpRequest) {
      req = new XMLHttpRequest();
    }
    else if(window.ActiveXObject) {
      req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    req.onreadystatechange = readyRequest;
    req.open('GET', url, true);
    req.send(null);
  }

  function readyRequest() {
    var html = '';
    if (req.readyState == XMLHttpRequest.DONE) {
      var people = JSON.parse(req.responseText).people;
      var peopleQuantity = people.length;
      for(var i=0; i<peopleQuantity; i++) {
        html += renderContact(people[i]);
      }
      document.querySelector('.js-contact-list').innerHTML = html;
    }
  }

  function renderContact(contact) {
    var html = '<div class="contact">No hay detalles</div>';
    if(contact != null ) {
      var age = 0, age = getAge(contact.birthdate);
      html = '<div class="contact">'
        +'<div class="contact-image" style="background-image: url('+contact.avatar_url+');"></div>'
        +'<div class="contact-body">'
          +'<h2>'+(contact.first_name+' '+contact.last_name)+'</h2>'
          +'<div><label>Age:</label> <span>'+age+'</span></div>'
          +'<div><label>E-mail:</label> <span>'+contact.email+'</span></div>'
          +'<div><label>Phone:</label> <span>'+contact.phone+'</span></div>'
        +'</div>'
      +'</div>';
    }
    return html;
  }

  function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  return {
    contentLoader: contentLoader
  }
})();

app.contentLoader('https://koombea-dummy-api.herokuapp.com/people/');
