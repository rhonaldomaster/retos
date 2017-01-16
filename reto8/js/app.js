var app = (function () {
  var config = {
    apiKey: 'AIzaSyAZvjSb5FI_zm_Ix4f3IvHlaSveB3SLTAg',
    authDomain: 'reto7-7356f.firebaseapp.com',
    databaseURL: 'https://reto7-7356f.firebaseio.com',
    storageBucket: 'reto7-7356f.appspot.com',
    messagingSenderId: '502924035394'
  };

  var appUser = null;

  var init = function () {
    firebase.initializeApp(config);
    setTimeout(function () {
      verifyIfIsLoggedIn();
    },300);

    document.addEventListener('submit', handleEvents);
    document.addEventListener('click', handleEvents);
  };

  var handleEvents = function (ev) {
    var element = ev.target;
    if ((element.className).indexOf('js-login-form') > -1) {
      login(ev);
    }
    else if ((element.className).indexOf('js-logout') > -1) {
      ev.preventDefault();
      logout();
    }
    else if ((element.className).indexOf('js-register-walk') > -1) {
      insertItem(ev);
    }
    else if ((element.className).indexOf('js-open-tab') > -1) {
      openTab(ev);
    }
    else if ((element.className).indexOf('js-delete-log') > -1) {
      removeItem(ev);
    }
    else if ((element.className).indexOf('js-modify-log') > -1) {
      showUpdateForm(ev);
    }
    else if ((element.className).indexOf('js-update-form') > -1) {
      updateItem(ev);
    }
  };

  var verifyIfIsLoggedIn = function () {
    var isLoggedIn = firebase.auth().currentUser != null;
    if (isLoggedIn) {
      appUser = firebase.auth().currentUser;
      document.querySelector('.js-login-div').classList.add('hidden');
      document.querySelector('.js-logged-user').classList.remove('hidden');
      document.querySelector('.js-login-form').reset();
      document.querySelector('.js-name').innerHTML = firebase.auth().currentUser.email;
      document.querySelectorAll('.js-tabs-header a')[0].click();
      walkingHistory();
    }
    else {
      document.querySelector('.js-login-div').classList.remove('hidden');
      document.querySelector('.js-logged-user').classList.add('hidden');
      document.querySelector('.js-name').innerHTML = '';
    }
  };

  var login = function (ev) {
    ev.preventDefault();
    var form = ev.target;
    var jsonForm = formToJSONString(form);
    var errorDiv = document.querySelector('.js-error-msg');

    jsonForm = JSON.parse(jsonForm);
    errorDiv.innerHTML = '';

    firebase.auth().signInWithEmailAndPassword(jsonForm.email, jsonForm.password)
    .then(function () {
      appUser = firebase.auth().currentUser;
      verifyIfIsLoggedIn();
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/user-not-found') {
        register(jsonForm);
      }
      else {
        errorDiv.innerHTML = errorMessage;
      }
    });
  };

  var register = function (jsonData) {
    var errorDiv = document.querySelector('.js-error-msg');

    firebase.auth().createUserWithEmailAndPassword(jsonData.email, jsonData.password)
    .then(function () {
      verifyIfIsLoggedIn();
    })
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      errorDiv.innerHTML = errorMessage;
    });
  };

  var logout = function () {
    firebase.auth().signOut().then(function() {
      verifyIfIsLoggedIn();
    }, function(error) {
      var errorDiv = document.querySelector('.js-error-msg');
      var errorCode = error.code;
      var errorMessage = error.message;
      errorDiv.innerHTML = errorMessage;
    });
  };

  var formToJSONString = function (form) {
    var obj = {};
    var elements = form.querySelectorAll( 'input, select, textarea' );

    for( var i = 0; i < elements.length; ++i ) {
      var element = elements[i];
      var name = element.name;
      var value = element.value;
      if( name ) {
        obj[ name ] = value;
      }
    }

    return JSON.stringify( obj );
  };

  var openTab = function (ev) {
    ev.preventDefault();
    var element = ev.target;
    tabcontent = document.querySelectorAll('.js-tab');

    for (var i = 0; i < tabcontent.length; i++) {
      tabcontent[i].classList.add('hidden');
    }
    tablinks = document.querySelectorAll('.js-tabs-header a');
    for (var i = 0; i < tablinks.length; i++) {
      tablinks[i].classList.remove('active');
    }

    document.querySelector(element.dataset.target).classList.remove('hidden');
    element.classList.add('active');
  };

  var sortBy = function (field, a, b, direction) {
    var NUMBER_GROUPS = /(-?\d*\.?\d+)/g;
    var a_field1 = (field ? a[field] : a),
        b_field1 = (field ? b[field] : b),
        aa = String(a_field1).split(NUMBER_GROUPS),
        bb = String(b_field1).split(NUMBER_GROUPS),
        min = Math.min(aa.length, bb.length);
    var dir = 1;
    if (direction) {
      dir = (direction.toLowerCase()) == 'asc' ? -1 : 1;
    }
    for (var i = 0; i < min; i++) {
      var x = parseFloat(aa[i]) || aa[i].toLowerCase(),
          y = parseFloat(bb[i]) || bb[i].toLowerCase();
      if (x < y) return -1 * dir;
      else if (x > y) return 1 * dir;
    }
    return 0;
  }

  var snapToSortedArray = function (snap,sortDirection) {
    var array = [];
    for (var item in snap) {
      if (snap.hasOwnProperty(item)) {
        array.push({id: item, date: snap[item].date, distance: snap[item].distance});
      }
    }
    array.sort(function (a,b) { return sortBy('date',a,b,sortDirection); });
    return array;
  };

  var walkingHistory = function () {
    var history = firebase.database().ref('users/'+(appUser.uid)+'/history');
    history.on('value', function(snapshot) {
      var html = '';
      var response = snapshot.val();
      var history = snapToSortedArray(response,'desc');

      for (var i = 0; i < history.length; i++) {
        html += '<tr>'
          +'<td>'+history[i].date+'</td>'
          +'<td>'+history[i].distance+' km</td>'
          +'<td>'
            +'<a href="#" class="button button--secondary push-adjust--right js-modify-log" data-id="'+history[i].id+'" data-date="'+history[i].date+'" data-distance="'+history[i].distance+'">Modify</a>'
            +'<a href="#" class="button button--terciary js-delete-log" data-id="'+history[i].id+'">Delete</a>'
          +'</td>'
        +'</tr>';
      }
      if (html != '') {
        html = '<table class="table--without-borders">'
          +'<tr>'
            +'<th>Date</th><th>Distance</th><th>Action</th>'
          +'</tr>'
          +html
        +'</table>';
      }
      else {
        html = 'There is no data';
      }

      document.querySelector('.js-walking-history').innerHTML = html;
    });
  };

  var insertItem = function (ev) {
    ev.preventDefault();
    var database = firebase.database();
    var form = ev.target;
    var jsonForm = formToJSONString(form);
    var infoDiv = document.querySelector('.js-registry-msg');

    jsonForm = JSON.parse(jsonForm);
    infoDiv.innerHTML = 'Your walk is being registered';

    var ref = database.ref('users/'+(appUser.uid)+'/history');
    var newLog = ref.push();
    newLog.set(jsonForm).then(function () {
      infoDiv.innerHTML = 'Your walk has been registered';
      form.reset();
      setTimeout(function () {
        infoDiv.innerHTML = '';
      },500);
    },function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      infoDiv.innerHTML = errorMessage;
    });
  };

  var removeItem = function (ev) {
    ev.preventDefault();
    var element = ev.target;
    var id = element.dataset.id;
    var infoDiv = document.querySelector('.js-log-msg');
    infoDiv.innerHTML = 'Processing';

    var database = firebase.database();
    var ref = database.ref('users/'+(appUser.uid)+'/history').child(id);
    ref.remove()
    .then(function () {
      infoDiv.innerHTML = 'Element removed sucessfully';
      setTimeout(function () {
        infoDiv.innerHTML = '';
      },500);
    })
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      infoDiv.innerHTML = errorMessage;
    });
  };

  var showUpdateForm = function (ev) {
    ev.preventDefault();
    var element = ev.target;
    var id = element.dataset.id, date = element.dataset.date, distance = element.dataset.distance;

    document.querySelector('.js-log-id').value = id;
    document.querySelector('.js-log-date').value = date;
    document.querySelector('.js-log-distance').value = distance;
    $.magnificPopup.open({items: {src: '.js-update-log', type: 'inline'}});
    $('.js-log-date').Zebra_DatePicker({direction:-1});
  };

  var updateItem = function (ev) {
    ev.preventDefault();
    var form = ev.target;
    var jsonForm = formToJSONString(form);
    var infoDiv = document.querySelector('.js-update-msg');

    jsonForm = JSON.parse(jsonForm);
    infoDiv.innerHTML = 'Processing';

    var database = firebase.database();
    var ref = database.ref('users/'+(appUser.uid)+'/history').child(jsonForm.id);
    ref.update({date:jsonForm.date,distance:jsonForm.distance})
    .then(function () {
      infoDiv.innerHTML = 'Element updated sucessfully';
      setTimeout(function () {
        $.magnificPopup.close();
        infoDiv.innerHTML = '';
      },500);
    })
    .catch(function (error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      infoDiv.innerHTML = errorMessage;
    });
  };

  return {
    init: init
  }
})();

app.init();
$('.js-datepicker').Zebra_DatePicker({direction:-1});
