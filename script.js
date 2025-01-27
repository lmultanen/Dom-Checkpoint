/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

 function updateCoffeeView(coffeeQty) {
  // your code here
  document.getElementById('coffee_counter').innerText = coffeeQty;
}

function clickCoffee(data) {
  // your code here
  // trying to make click coffee scale somewhat with cps
  let increment = 1;
  if (data.hasOwnProperty('totalCPS')) {
    increment += Math.floor(data.totalCPS/10);
  }
  data.coffee += increment;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  // your code here
  producers.forEach(element => {
      if (coffeeCount >= element.price/2) {
        element.unlocked = true;
      }    
  });
}

function getUnlockedProducers(data) {
  // your code here
  return data.producers.filter(element => element.unlocked);
}

function makeDisplayNameFromId(id) {
  // your code here
  let strArray = id.split('_');
  return strArray.map(word => word[0].toUpperCase() + word.slice(1))
                  .join(' ');
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  // your code here
  while (parent.childNodes.length > 0) {
    parent.removeChild(parent.firstChild);
  }

}

function renderProducers(data) {
  // your code here
  updateCoffeeView(data.coffee);
  unlockProducers(data.producers, data.coffee);
  // need to remove all children before adding unlocked producers
  let producerContainer = document.getElementById('producer_container');
  deleteAllChildNodes(producerContainer);
  // appending unlocked producers to the as-of-now empty producerContainer
  let unlockedProducers = getUnlockedProducers(data);
  unlockedProducers.forEach(producer => {
    producerContainer.appendChild(makeProducerDiv(producer));
  });
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  // your code here
  return data.producers.filter(producer => producer.id === producerId)[0];
}

function canAffordProducer(data, producerId) {
  // your code here
  let producer = getProducerById(data, producerId);
  return data.coffee >= producer.price;
}

function updateCPSView(cps) {
  // your code here
  document.getElementById('cps').innerText = cps;
}

function updatePrice(oldPrice) {
  // your code here
  return Math.floor(1.25*oldPrice);
}

function attemptToBuyProducer(data, producerId) {
  // your code here
  let canAfford = canAffordProducer(data, producerId);
  if (canAfford) {
    let producer = getProducerById(data, producerId);
    producer.qty += 1;
    data.coffee -= producer.price;
    producer.price = updatePrice(producer.price);
    data.totalCPS += producer.cps;
  }
  return canAfford;
}

function buyButtonClick(event, data) {
  // your code here
  if (event.target.tagName === "BUTTON") {
    // getting producer ID from event object
    let producerId = event.target.id.slice(4);
    let successBool = attemptToBuyProducer(data, producerId);
    if (!successBool) {
      window.alert("Not enough coffee!");
    }
    else {
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);
    }
  }
}

function tick(data) {
  // your code here
  // += didn't work here, unsure why
  data.coffee = data.totalCPS + data.coffee;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
