var app = (function () {
  var config = {
    apiKey: 'AIzaSyAZvjSb5FI_zm_Ix4f3IvHlaSveB3SLTAg',
    authDomain: 'reto7-7356f.firebaseapp.com',
    databaseURL: 'https://reto7-7356f.firebaseio.com',
    storageBucket: 'reto7-7356f.appspot.com',
    messagingSenderId: '502924035394'
  };

  var init = function () {
    firebase.initializeApp(config);
    setTimeout(function () {
      verifyIfIsLoggedIn();
    },300);
    document.addEventListener('submit', handleEvents);
    document.addEventListener('click', handleEvents)
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
  };

  var verifyIfIsLoggedIn = function () {
    var isLoggedIn = firebase.auth().currentUser != null;
    if (isLoggedIn) {
      document.querySelector('.js-login-div').style.display = 'none';
      document.querySelector('.js-logged-user').style.display = 'block';
      document.querySelector('.js-login-form').reset();
      document.querySelector('.js-name').innerHTML = firebase.auth().currentUser.email;
    }
    else {
      document.querySelector('.js-login-div').style.display = 'block';
      document.querySelector('.js-logged-user').style.display = 'none';
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
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/user-not-found') {
        register(jsonForm);
      }
      else {
        errorDiv.innerHTML = errorMessage;
      }
    }).then(function () {
      verifyIfIsLoggedIn();
    });
  };

  var register = function (jsonData) {
    var errorDiv = document.querySelector('.js-error-msg');
    firebase.auth().createUserWithEmailAndPassword(jsonData.email, jsonData.password)
    .catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      errorDiv.innerHTML = errorMessage;
    }).then(function () {
      verifyIfIsLoggedIn();
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

  return {
    init: init
  }
})();

app.init();
