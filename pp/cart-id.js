
    // get cart ID. We may not need this code for the Gift Guide but let's put it here just in case.

    const getLoggedInCartID = new Promise((resolve, reject) => {
      jQuery.post('https://' + window.location.hostname + '/rest/V1/carts/mine',
      function(data, status) { resolve(data); }).fail(() => { resolve(null); });
    });

    const getCartID = async function() {
      getLoggedInCartID
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          return null;
        });
    }

    // This works for logged in ...

    const getLoggedInCartID = new Promise((resolve, reject) => {
      jQuery.post('https://' + window.location.hostname + '/rest/V1/carts/mine',
      function(data, status) { resolve(data); }).fail(() => { resolve(null); });
    });

    const getCartID = async function() {
      getLoggedInCartID
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          return null;
        });
    }