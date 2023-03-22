

// TEST CODE


require(['jquery','Magento_Customer/js/customer-data', 'Magento_Checkout/js/model/cart/cache', 'Magento_Customer/js/model/customer'], function($, customerData, cartCache, customer) {

  // var sections = ['cart'];
  // customerData.invalidate(sections);
  // customerData.reload(sections, true);
  // cartCache.set('totals', null);

    let cart = customerData.get('cart')();
console.log(cart);
    })



'{"cartItem":{"sku":"T1100-6","qty":1,"quote_id":""}}';

const getSku = function(sku) {
  var queryURL = window.checkout.baseUrl + '/rest/all/V1/products-render-info?searchCriteria[filterGroups][0][filters][0][field]=sku&searchCriteria[filterGroups][0][filters][0][value]=' + sku + '&storeId=' + window.checkout.storeId + '&currencyCode=$';

  jQuery.ajax({
    'async': true,
    'global': false,
    'url': queryURL,
    'dataType': "json",
    'success': function(data) {
      console.log(data);
    },
    error: function(error) {
      console.error(error);
    }
  });
}

fetch('https://mcstaging2.terro.com/rest/V1/carts/mine/items',  {
        'method':'POST',
        'body': '{"cartItem":{"sku":"T1100-6","qty":1,"quote_id":"5909"}}',
        'headers': {
          'type':'POST',
          'Content-Type': 'application/json',
          'accept':'*/*',
          "X-Requested-With": "XMLHttpRequest"
        }
      }).then((res) => res.json()).then((data) => console.log(data));

      getCart = function() {
        $.ajax({
          url: baseURL + 'carts/mine/items',
          type:'GET',
          contentType: "application/json",
          success: function(data, textStatus, jqXHR) {
            if (data.length > 0) { clearItemFromCart(data); }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            return null;
          }
        });
      }