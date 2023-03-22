require(['jquery','Magento_Customer/js/customer-data', 'Magento_Checkout/js/model/cart/cache', 'Magento_Customer/js/model/customer'], function($, customerData, cartCache, customer) {

  let storeID = window.checkout.storeId;
  let baseURL = 'https://mcstaging2.terro.com/';
  let userLoggedIn = true;
  let cartID;
  let freeSkuID;

  let cart = customerData.get('cart');
  let giftAdded, count;

  let freeGiftSku = 'T514';

  // Modal Control

  const hideModal = function() {
    $('.tr-modal-content').hide();
    $('.tr-modal-screen').hide();
  }

  const showModal = function() {
    $('.tr-modal-content').show();
    $('.tr-modal-screen').show();
  }

  $('.tr-modal-screen').on('click', function() { hideModal(); });
  $('#free-gift-modal-close').on('click', function() { hideModal(); });

  // Check cart object for product

  const isInCart = function(sku) {
    let items = customerData.get('cart')().items;
    let response = {
      inCart: false
    };
    for (let i = 0; i < items.length; i++) {
      if (items[i].product_sku == sku) {
        response.inCart = true;
        response.qty = items[i].qty;
        response.product_id = items[i].product_id;
        freeSkuID = items[i].item_id;
        break;
      }
    }
    return response;
  }

  // Use Knockout to subscribe to cart changes

  cart.subscribe(async() => {
    if (cart().summary_count !== count) { // cart contents have changed
      count = cart().summary_count; // update cart count
      let sku = isInCart(freeGiftSku);
      console.log(count > 0);
      if (count > 0 && !sku.inCart) {
        let response = await addToCart(freeGiftSku, 1);
        let body = await response.json();
        if (response.status != 200) {
          //throw new Error(body.message);
        } else {
          updateMiniCart();
          showModal();
        }
      } else if (count == 1) {
        console.log('the only item in the cart is the free item, so we remove it...');
        let response = await removeFromCart(freeGiftSku);
        let body = await response.json();
        if (response.status != 200) {
          //throw new Error(body.message);
        } else {
          updateMiniCart();
        }
      }
    }
  });

  // Cart Handling

  const getHeaders = (method, payload = null) => {
    let headers = {
      'method':method,
      'headers': {
        'type':method,
        'Content-Type': 'application/json',
        'accept':'*/*',
        "X-Requested-With": "XMLHttpRequest"
      }
    };
    if (payload != null) {
      headers.body = payload;
    };
    return headers;
  }

  const getLoggedInCartID = async () => {
    let headers  = getHEaders('GET');
    const response = await fetch(baseURL + 'rest/V1/carts/mine', headers);
    let body = await response.json();
    if (response.status != 200) {
      throw new Error(body.message);
    } else {
      return body;
    }
  }

  const createNewGuestCart = async () => {
    let headers  = getHEaders('POST');
    let response = await fetch(baseURL + 'rest/all/V1/guest-carts', headers)
    let body = await response.json();
    if (response.status != 200) {
      throw new Error(body.message);
    } else {
      return body;
    }
  }

  const getGuestCartID = async () => {
    userLoggedIn = false;
    let cart = customerData.get('cart')();
    let actions = cart.extra_actions;
    if (cart == {} || !actions) {
      try {
        let cartID = await createNewGuestCart();
        return cartID;
      } catch (error) {
        return error;
      }
    } else {
      let start = cart.extra_actions.indexOf('quoteId') + 10;
      let cartID = cart.extra_actions.substring(start, start + 32);
      return cartID;
    }
  }

  const getCartID = async () => {
    try {
      let cartID = await getLoggedInCartID();
      return cartID.id;
    } catch (error) {
      let cartID = await getGuestCartID();
      return cartID;
    }
  }

  const updateMiniCart = () => {
    var sections = ['cart'];
    customerData.invalidate(sections);
    customerData.reload(sections, true);
    cartCache.set('totals', null);
  }

  const addToCart = async (sku, qty) => {
    let url;
    let cartID = await getCartID();
    let cartObj = { 'cartItem': { 'sku': sku, 'qty': parseInt(qty), 'quote_id':cartID } };
    let payload = JSON.stringify(cartObj);

    if (userLoggedIn) {
      url = baseURL + 'rest/V1/carts/mine/items';
    } else {
      url = baseURL + 'rest/V1/guest-carts/'+ cartID + '/items';
    }

    let headers = getHeaders('POST', payload);

    try {
      let response = await fetch(url, headers);
      let body = await response.json();
      if (response.status != 200) {
        throw new Error(body.message);
      } else {
        updateMiniCart();
        console.log('product added to cart.');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const removeFromCart = async (sku) => {
    let url;
    let headers = getHeaders('DELETE');
    if (userLoggedIn) {
      url = baseURL + "rest/V1/carts/mine/items/" + freeSkuID;
    } else {
      url = baseURL + 'rest/all/V1/guest-carts/' + cartID + '/items/' + freeSkuID;
    }
    let response = await fetch(url, headers);
    let body = await response.json();
    if (response.status != 200) {
      throw new Error(body.message);
    } else {
      updateMiniCart();
      console.log('product removed from cart.');
    }
  };

});
