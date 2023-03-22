require(['jquery'], function($) {

  let giftGuideProducts = [
    {
      category:'price-low',
      skus: ['9100','379CS','284','310','345','388F']
    },
    {
      category:'price-medium',
      skus: ['114G','204CP-4','CFE101','B481FKIT','363','9107-2']
    },
    {
      category:'price-high',
      skus: ['9111-1SR','50172','C00322','BHBCOPPER','bdh00348','BCOPPERTPL']
    },
    {
      category:'color-red',
      skus: ['284','204CP-4','8130-2','GAZ02','C00322','BSEEDBASICS']
    },
    {
      category:'color-blue',
      skus: ['388F','CFE101','8117-2','8136-2','9107-2','bdh00348']
    },
    {
      category:'color-green',
      skus: ['GSB00344','114G','8120-2','HF940','9111-1SR','339']
    },
    {
      category:'color-yellow',
      skus: ['399-6','390','YSSF00348','B481FKIT','YB5F00340','9110-2']
    },
    {
      category:'color-black',
      skus: ['310','3266','395','112','363','333-1SR']
    },
    {
      category:'color-metallic',
      skus: ['312','9104-1SR','385-2','8110H-1','BHBCOPPER','BCOPPERTPL']
    },
    {
      category:'bird-songbird',
      skus: ['112','347','363','SBG101','50172','BCOPPERTPL']
    },
    {
      category:'bird-hummingbird',
      skus: ['9100','8120-2','9104-1SR','8130-2','9111-1SR','BHBCOPPER']
    },
    {
      category:'bird-finch',
      skus: ['379CS','399-6','B481FKIT','385-2','YB5F00340','bdh00348']
    },
    {
      category:'bird-oriole',
      skus: ['465-2','253','467-4','209BO-4','8135-2','B9113KIT']
    },
    {
      category:'bird-all',
      skus: ['9100','399-6','347','SBG101','B9113KIT','BHBCOPPER','bdh00348','BCOPPERTPL']
    },
    {
      category:'stocking',
      skus: ['9100','215P','379CS','85','91YF','23T','245L','244CLSF']
    }
  ]

  // Panel Navigation Logic

  $('.gift-guide .cta.nav').on('click', function() {
    let target = $(this).attr('data-target');
    $('.panel').attr('aria-hidden', true);
    $(`#${target}`).attr('aria-hidden', false);
    validate();
    if (target == 'gg-products') { showProducts(); }
  });

  $('#gg-shop-by input.category').on('change', function() {
    let target = $(this).attr('data-target');
    $('#gg-products .cta.next').attr('data-target', target);
    $('#gg-shop-by .cta.next').attr('data-target', target);
    validate();
  });

  // User Option Logic

  let userOption = {};

  $('.option label').on('keydown', function(e) {
    if (e.which == 32 || e.which == 13) {
      $(this).find('input').trigger('click');
    }
  });

  $('.user-option').on('click', function() {
    userOptionClick(this);
  });

  const userOptionClick = function(el) {
    userOption.type = $(el).attr('name');
    userOption.value = $(el).val();
    validate();
  }

  $('.option label').on('keyup', function(e) {
    if (e.which == 13 || e.which == 32) {
      $(this).trigger('click');
      validate();
    }
  })

  const validate = function() {
    let categories = ['shop-by','price','bird','color'];
    categories.forEach(category => {
      if ($(`#gg-${category} input[name="${category}"]:checked`).val() == undefined) {
        $(`#gg-${category} .cta.next`).attr('disabled',true);
      } else {
        $(`#gg-${category} .cta.next`).attr('disabled',false);
      }
    });
  }

  const showProducts = function() {
    $('#gg-products .products-collection .products').attr('aria-hidden', true);
    $(`#${userOption.value}`).attr('aria-hidden', false);
  }

   // create list of all SKUs, remove duplicates

  let allSkus = [];
  let productData = [];

  giftGuideProducts.forEach(function(collection) {
    allSkus = [...new Set([...allSkus ,...collection.skus])];
  });

  const processSku = function(sku, skuData) {
    if (skuData != undefined) {
      let product = {};
      product.sku = sku;
      product.title = skuData.name;
      product.imageURL = skuData.images[0].url;
      product.imageAlt = skuData.images[0].label;
      product.imageWidth = skuData.images[0].width;
      product.imageHeight = skuData.images[0].height;
      product.isSalable = skuData.is_salable;
      product.url = skuData.url;
      product.price = skuData.price_info.final_price;
      productData.push(product);
    }
    finished();
  }

  const populateGiftGuide = async function() {
    allSkus.forEach((sku) => {
      fetch('https://' + window.location.host + '/rest/all/V1/products-render-info?searchCriteria[filterGroups][0][filters][0][field]=sku&searchCriteria[filterGroups][0][filters][0][value]=' + sku + '&storeId=31&currencyCode=$')
        .then((res) => { return res.json(); })
        .then((data) => {
          if (data.items.length == 0) {
            console.error(`ws-gift-guide: '${sku}' not found.`);
            finished();
          } else {
            processSku(sku, data.items[0]);
          }
        });
    });
  }

  let count = 0;

  const finished = function() {
    count++;
    if (count == allSkus.length) {
      giftGuideProducts.forEach((section) => {
        renderCategorySkus(section.category);
      });
    }
  }

  const renderProduct = function(category, productData) {
    if (productData.isSalable != '') {
      let main = document.createElement('div');
      $(main).addClass('gg-product-item').attr({
        'data-sku': productData.sku
      });
      let imgWrap = document.createElement('div');
      $(imgWrap).addClass('product-image');
      let img = document.createElement('img');
      $(img).attr({
        'alt':productData.imageAlt,
        'src':productData.imageURL,
        'height':productData.imageHeight,
        'width':productData.imageWidth
      });
      $(imgWrap).append(img);
      let link = document.createElement('a');
      $(link).addClass('abs-link').attr({
        'href':productData.url + '?utm_source=perkypet.com&utm_medium=referral&utm_campaign=GiftGuide2021',
        'aria-label':productData.title
      });
      let price = document.createElement('span');
      $(price).addClass('product-price').text(`$${productData.price}`);
      let title = document.createElement('span');
      $(title).addClass('product-title').text(productData.title);
      let cta = document.createElement('span');
      $(cta).addClass('cta center').html('Shop This');
      $(main).append(link).append(imgWrap).append(title).append(price).append(cta);
      return main;
    } else {
      return null;
    }
  }

  const renderCategorySkus = function (category) {
    let categorySkuList = getCategoryProductData(category);

    let categoryEl = $(`#${category} .products-wrap`);
<<<<<<< HEAD
=======
    categoryEl.find('.spinner').remove();
>>>>>>> 1b8d3d325f8d35dea034aeb571d048a73e9267e8

    if (categorySkuList.length > 0) {
      productData.forEach((product) => {
        if (categorySkuList.indexOf(product.sku) != -1) {
          let productHTML = renderProduct(category, product);
          categoryEl.append(productHTML);
        }
      });
    } else {
      console.error(`ws-gift-guide: No SKUs found for category '${targetCategory}'`);
    }
  }

  const getCategoryProductData = function(targetCategory) {
    let skuList;
    giftGuideProducts.forEach((cat) => {
      if (cat.category == targetCategory) {
        skuList = [...cat.skus];
      }
    });
    return skuList;
  }

  populateGiftGuide();

});
