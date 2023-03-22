require(['jquery','Magento_Customer/js/customer-data', 'Magento_Checkout/js/model/cart/cache', 'Magento_Customer/js/model/customer'], function($, customerData, cartCache, customer) {

  let storeID = window.checkout.storeId;
  let baseURL = 'https://www.terro.com/';
  let userLoggedIn = false;
  let cartID;
  let freeSkuID;

  let cart = customerData.get('cart');
  let giftAdded, count;
  let cartFailure = false;

  let freeGiftSku = 'T103';

  const hideModal = function() {
    $('.tr-modal-content').attr('aria-hidden', true);
    $('.tr-modal-content').hide();
    $('.tr-modal-screen').hide();
  }

  const showModal = function() {
    $('.tr-modal-content').attr('aria-hidden', false);
    $('.tr-modal-content').show();
    $('.tr-modal-screen').show();
  }

  $('.tr-modal-screen').on('click', hideModal);
  $('#free-gift-modal-close').on('click', hideModal);

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

  cart.subscribe(function () {
    let count = cart().summary_count; // update cart count
    let sku = isInCart(freeGiftSku);
    if (count > 0 && !sku.inCart) {
      if (sku.inCart == false) {
        addToCart(freeGiftSku, 1).then((res) => {
          if (res == true) {
            // //console.log('Show Modal that announces free gift. Once per session.');
            showModal();
          } else {
            //console.log(res);
          }
        });
      }
    } else if (count == 1 && sku.inCart) {
      removeFromCart(freeGiftSku).then((res) => {
        //console.log(res);
        updateMiniCart();
      });
    }
  });

  const removeFromCart = async (sku) => {
    return new Promise((resolve, reject) => {
      //console.log('Remove ' + sku + ' from cart.');
      //console.log('cartID         : ' + cartID);
      //console.log('user logged in : ' + userLoggedIn);
      //console.log('product ID     : ' + freeSkuID);
      getCartID().then((data) => {
        let url;
        cartID = data;

        if (userLoggedIn) {
          url = baseURL + "rest/V1/carts/mine/items/" + freeSkuID;
        } else {
          url = baseURL + 'rest/all/V1/guest-carts/' + cartID + '/items/' + freeSkuID;
        }

        fetch(url,
        {
          'method':'DELETE',
          'headers': {
            'type':'DELETE',
            'Content-Type': 'application/json',
            'accept':'*/*',
            "X-Requested-With": "XMLHttpRequest"
          }
        })
        .then((res) => res.json())
        .then((data) => {
          resolve(true);
        });
      });
    });
  }

  const createNewGuestCart = function() {
    return new Promise((resolve, reject) => {
      fetch(baseURL + 'rest/all/V1/guest-carts',
        {
          'method':'POST',
          'headers': {
            'type':'POST',
            'Content-Type': 'application/json',
            'accept':'*/*',
            "X-Requested-With": "XMLHttpRequest"
          }
        })
        .then((res) => res.json())
        .then((data) => {
          resolve(data);
        });
    });
  }

  const getLoggedInCartID = async () => {
    //console.log('Looking for Logged-In Cart ID...');
    return new Promise((resolve, reject) => {
      fetch(baseURL + 'rest/V1/carts/mine',
      {
        'method':'GET',
        'headers': {
          'type':'GET',
          'Content-Type': 'application/json',
          'accept':'*/*',
          "X-Requested-With": "XMLHttpRequest"
        }
      })
      .then((res) => {
        if (res.status != 200) {
          //console.log('Looks like user is logged out.')
          throw new Error('logged out');
        } else {
          return res.json();
        }
      }).then((data) => {
        //console.log('Looks like user is logged in.')
        resolve(data.id);
      }).catch((error) => {
        reject(false);
      });
    });
  }

  const getGuestCartID = async (sku, qty) => {
    //console.log('Getting Guest Cart ID');
    return new Promise((resolve, reject) => {
      let cart = customerData.get('cart')();
      let actions = cart.extra_actions;
      if (cart == {} || !actions) {
        //console.log('Creating New Guest Cart ID');
        createNewGuestCart()
        .then((data) => {
          resolve(data);
        });
      } else {
        //console.log('Retrieving Existing Guest Cart ID');
        let start = cart.extra_actions.indexOf('quoteId') + 10;
        cartID = cart.extra_actions.substring(start, start + 32);
        resolve(cartID);
      }
    });
  }

  const getCartID = async () => {
    //console.log('Getting Cart ID...');
    return new Promise((resolve, reject) => {
      getLoggedInCartID()
      .then((data) => {
        userLoggedIn = true;
        resolve(data);
      })
      .catch((error) => {
        getGuestCartID()
        .then((data) => {
          resolve(data);
        });
      })
    });
  }

  const updateMiniCart = () => {
    var sections = ['cart'];
    customerData.invalidate(sections);
    customerData.reload(sections, true);
    cartCache.set('totals', null);
  }

  const addToCart = async (sku, qty) => {
    return new Promise((resolve, reject) => {
      //console.log('Add ' + freeGiftSku + ' to cart.');
      getCartID()
      .then((data) => {
        let url;
        cartID = data;
        let cartObj = { 'cartItem': { 'sku': sku, 'qty': parseInt(qty), 'quote_id':data } };
        let payload = JSON.stringify(cartObj);
        if (userLoggedIn) {
          url = baseURL + 'rest/V1/carts/mine/items';
        } else {
          url = baseURL + 'rest/V1/guest-carts/'+ cartID + '/items';
        }
        //console.log('cartID         : ' + data);
        //console.log('user logged in : ' + userLoggedIn);
        //console.log('payload        : ' + payload);
        //console.log('url            : ' + url);
        if (!cartFailure) {
          fetch(url, {
            'method':'POST',
            'body': payload,
            'headers': {
              'type':'POST',
              'Content-Type': 'application/json',
              'accept':'*/*',
              "X-Requested-With": "XMLHttpRequest"
            }
          })
          .then((res) => {
            if (res.status !=200) {
              res.json().then((body) => {
                console.log(body);
                cartFailure = true;
                throw new Error(body.message);
              });
            } else {
              return res.json();
            }
          })
          .then((data) => {
            //console.log(data);
            updateMiniCart();
            resolve(true);
          })
          .catch((error) => {
            reject(error);
          })
        }
      });
    });
  }
});