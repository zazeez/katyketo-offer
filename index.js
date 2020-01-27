'use strict';

let client;
let checkout;
let collection;
let lineItemIds=[];
let itemSelected=false;
let termChecked=false;

// intializing to connect to our store to Shopify's API
function initializeClient () {
  let url = 'https://zach-api.counsel.bitbakeryapps.in/api?path=storefront_access_tokens.json'  

  fetch(url, {type: 'POST'})
    .then((res) => {
      return res.json()
    })
    .then((res) => {    
      res = JSON.parse(res);
      let accessToken = res.storefront_access_tokens[0].access_token;

      client = ShopifyBuy.buildClient({
                        domain: 'katy-keto.myshopify.com',
                        storefrontAccessToken: accessToken
                    });  
      client.checkout.create().then((co) => {  
        checkout = co;      
        fetchCollection();      
      });                    
    });
};

async function fetchCollection () {  
  let collectionId = btoa(`gid://shopify/Collection/161766015057`);

  collection = await client.collection.fetchWithProducts(collectionId);
  displayProducts(collection.products);
}

function displayProducts(products) {
    $('#js-1-month').append(`
    <li>
      <img src=${collection.products[2].images[0].src} class="product-images"/>
      <p class="offer-title">1 Month</p>
      <p class="price-per-day">$${collection.products[2].variants[0].price/15}/day</p>
    </li>      
  `)

  $('#js-3-months').append(`
    <li>
      <img src=${collection.products[1].images[0].src} class="product-images"/>
      <p class="offer-title">3 Months</p>
      <p class="price-per-day">$${collection.products[1].variants[0].price/15}/day</p>
    </li>      
  `)

  $('#js-6-months').append(`
    <li>
      <img src=${collection.products[0].images[0].src} class="product-images"/>
      <p class="offer-title">6 Months</p>
      <p class="price-per-day">$${collection.products[0].variants[0].price/15}/day</p>
    </li>      
  `)

  $('#spinner').hide();
};

//remove previous items from the cart
async function emptyCart () {  
  await client.checkout.removeLineItems(checkout.id, lineItemIds);
  lineItemIds = [];
  return;

};

// offer click functions to add items to a checkout and assign the checkout URL to the checkout button
async function click1month () {
  await emptyCart();

  const checkoutId = checkout.id;
  const lineItemsToAdd = [
    {
      variantId: collection.products[2].variants[0].id,
      quantity: 1      
    }    
  ];
  client.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
    lineItemIds.push(checkout.lineItems[0].id)
  });
    $('#js-checkout-button').html(`
  <form action="${checkout.webUrl}">
  <input type="submit" value="Checkout" id="checkout-button"/>
  </form>`)
};


async function click3months() {
  await emptyCart();

  const checkoutId = checkout.id;
  const lineItemsToAdd = [
    {
      variantId: collection.products[1].variants[0].id,
      quantity: 1      
    }    
  ];
  client.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
    lineItemIds.push(checkout.lineItems[0].id);
  });
$('#js-checkout-button').html(`
<form action="${checkout.webUrl}">
<input type="submit" value="Checkout" id="checkout-button"/>
</form>`)
};

async function click6months() {
  await emptyCart();

  const checkoutId = checkout.id;
  const lineItemsToAdd = [
    {
      variantId: collection.products[0].variants[0].id,
      quantity: 1      
    }    
  ];
  client.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
    lineItemIds.push(checkout.lineItems[0].id);
  });
$('#js-checkout-button').html(`
  <form action="${checkout.webUrl}">
  <input type="submit" value="Checkout" id="checkout-button"/>
  </form>`)
};

// check that both an item are selected and the terms box is checked
function checkItemsAndTerms () {
  if(itemSelected && termChecked) {
    $("#js-checkout-button-disabled").hide();
    $("#js-checkout-button").css('display','flex');
  }
}

// listeners for clicks and adjusting highlight color for selected item
function initializeListeners () {
  $('#js-1-month').on('click', function(event){
    itemSelected=true;
    $("#js-3-months").removeClass('offer-item-selected');
    $("#js-6-months").removeClass('offer-item-selected');
    $(event.currentTarget).toggleClass('offer-item-selected');
    click1month();
  });

  $('#js-3-months').on('click', function(){
    itemSelected=true;
    $("#js-1-month").removeClass('offer-item-selected');
    $("#js-6-months").removeClass('offer-item-selected');
    $(event.currentTarget).toggleClass('offer-item-selected');
    click3months();
  });

  $('#js-6-months').on('click', function(){
    itemSelected=true;
    $("#js-3-months").removeClass('offer-item-selected');
    $("#js-1-month").removeClass('offer-item-selected');
    $(event.currentTarget).toggleClass('offer-item-selected');
    click6months();
  });
  
  $('#terms').on('click', function(){
    termChecked=true;
    checkItemsAndTerms();
  });
}

function bootUp() {
    initializeClient()
    initializeListeners()    
   };
  
   $(bootUp);