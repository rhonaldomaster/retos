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
      var results = JSON.parse(req.responseText).results;
      var resultsQuantity = results.length;
      for(var i=0; i<resultsQuantity; i++) {
        html += renderProduct(results[i]);
      }
      document.querySelector('.js-result-list').innerHTML = html;
    }
  }

  function renderProduct(product) {
    var html = '<div class="product">No hay detalles</div>';
    if(product != null ) {
      var variantOptions = '<option value="">Talla</option>';
      (product.variant2).forEach(function (e,i,a) {
        variantOptions += '<option value="'+e.id+'">'+e.name+'</option>';
      });
      html = '<div class="product">'
        +'<div class="product__image" style="background-image:url('+product.featuredImage+')"></div>'
        +'<div class="product__info">'
          +'<h3>'+product.title+'</h3>'
          +'<span>'
            +'Precio '+(product.onSale?product.beforePrice+' Ahora ':'')
            +(product.priceVaries?product.pricevariation:product.price)
          +'</span>'
          +'<div>'
            +'<select class="js-add-item-'+product.id+'">'+variantOptions+'</select>'
            +'<button type="submit" name="add" class="btn js-addtocart" data-product="'+product.id+'" onclick="app.addToCartFromGrid(this)">Agregar</button>'
          +'</div>'
        +'</div>'
        +'<div class="product-grid-error js-product-grid-error-'+product.id+'">'
          +'<div class="triangle-border">'
            +'<div class="triangle"></div>'
          +'</div>'
          +'<div class="product-grid-error__content text-center">Debe seleccionar una talla</div>'
        +'</div>'
        +'</div>'
      '</div>';
    }
    return html;
  }

  function addToCartFromGrid (e) {
    //e.preventDefault();
    var $elem = e;
    var productId = $elem.dataset.product;
    var item = document.querySelector('.js-add-item-'+productId);
    var $errorMsg = document.querySelector('.js-product-grid-error-'+productId);
    if( item.value != '' || item.value==null){
      $errorMsg.style.display = 'none';
    }
    else {
      $errorMsg.style.display = 'block';
    }
  }

  return {
    contentLoader: contentLoader,
    addToCartFromGrid: addToCartFromGrid
  }
})();

app.contentLoader('js/producto.json');
/*var adds = document.querySelectorAll('.js-addtocart');
adds.addEventListener('click', app.addToCartFromGrid, false);*/
