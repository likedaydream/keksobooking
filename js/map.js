'use strict';

function getRandFromArray(arr, unique) {
  unique = typeof unique === 'undefined' ? false : unique;

  if (arr.length < 1) {
    console.error('length < 1');
    return null;
  }

  let key = Math.floor(Math.random() * arr.length);
  let value = arr[key];

  if (unique) {
    arr.splice(key, 1);
  }

  return value;
}

function getRandUniqueFromArray(arr) {
  return getRandFromArray(arr, true);
}

function getRandInt(min, max) {
  let diff = max + 1 - min;
  let rand = Math.ceil(Math.random() * diff);
  let result = rand + min - 1;

  return result;
}

function arrayShuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function getSimilar() {
  let similar = [];

  let similarCount = 8;

  let imageValues = [];

  for (let i = 1; i <= similarCount; i++) {
    let imageKey = i < 10 ? '0' + i : i;
    let imageSrc = `img/avatars/user${imageKey}.png`;
    imageValues.push(imageSrc);
  }

  let titleValues = [
    "Большая уютная квартира",
    "Маленькая неуютная квартира",
    "Огромный прекрасный дворец",
    "Маленький ужасный дворец",
    "Красивый гостевой домик",
    "Некрасивый негостеприимный домик",
    "Уютное бунгало далеко от моря",
    "Неуютное бунгало по колено в воде"
  ];

  let typeValues = [
    'palace',
    'flat',
    'house',
    'bungalo'
  ];

  let checkinValues = [
    '12:00',
    '13:00',
    '14:00',
  ];

  let checkoutValues = checkinValues.concat([]);
  let featuresValues = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner',
  ];

  let photosValues = [
    "http://o0.github.io/assets/images/tokyo/hotel1.jpg",
    "http://o0.github.io/assets/images/tokyo/hotel2.jpg",
    "http://o0.github.io/assets/images/tokyo/hotel3.jpg"
  ];

  let mapWidth = document.querySelector('.map__pins').offsetWidth;
  mapWidth = Math.floor(mapWidth);

  for (let i = 0; i < similarCount; i++) {
    let itemFeatures = [];
    let itemFeaturesValues = featuresValues.slice();

    let itemFeaturesCount = getRandInt(1, featuresValues.length);

    for (let j = 0; j < itemFeaturesCount; j++) {
      itemFeatures.push(getRandUniqueFromArray(itemFeaturesValues));
    }

    let itemPhotos = arrayShuffle(photosValues.slice());

    let itemLocation = {
      x: getRandInt(50, mapWidth - 50), // change to block sizes
      y: getRandInt(130, 630)
    };
    let itemAddress = `${itemLocation.x}, ${itemLocation.y}`;

    let itemAvatar = getRandUniqueFromArray(imageValues);

    let item = {
      author: {
        avatar: itemAvatar
      },
      offer: {
        id: i,
        title: getRandUniqueFromArray(titleValues),
        address: itemAddress,
        price: getRandInt(1000, 1000000),
        type: getRandFromArray(typeValues),
        rooms: getRandInt(1, 5),
        guests: getRandInt(1, 4),
        checkin: getRandFromArray(checkinValues),
        checkout: getRandFromArray(checkoutValues),
        features: itemFeatures,
        description: '',
        photos: itemPhotos,
        location: itemLocation
      }
    };

    similar.push(item);
  }

  return similar;
}

function generatePin(data) {
  let pin = pinTemplate.cloneNode(true);
  let img = pin.querySelector('img');

  pin.dataset.id = data.offer.id;

  img.src = data.author.avatar;
  img.alt = data.offer.title;

  let offsetX = data.offer.location.x - Math.floor(pinWidth / 2);
  let offsetY = data.offer.location.y - pinHeight;

  pin.style.left = offsetX + 'px';
  pin.style.top = offsetY + 'px';
  // adjust position

  return pin;
}

function showPins(data) {
  let fragment = document.createDocumentFragment();

  for (let i = 0; i < data.length; i++) {
    let pin = generatePin(data[i]);
    fragment.appendChild(pin);
  }

  let container = document.querySelector('.map__pins');
  container.appendChild(fragment);
}

function showOffer(data) {
  var prevOfferElement = document.querySelector('.map').querySelector('.map__card');

  if (prevOfferElement) {
    prevOfferElement.remove();
  }

  let offer = offerTemplate.cloneNode(true);

  offer.querySelector('.popup__title').textContent = data.offer.title;
  offer.querySelector('.popup__text--address').textContent = data.offer.address;
  offer.querySelector('.popup__text--price').firstChild.textContent = data.offer.price + '₽';

  let types = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };
  let type = types[data.offer.type];

  offer.querySelector('.popup__type').textContent = type;

  offer.querySelector('.popup__text--capacity').textContent = `${data.offer.rooms} комнаты для ${data.offer.guests} гостей`;
  offer.querySelector('.popup__text--time').textContent = `Заезд после ${data.offer.checkin}, выезд до ${data.offer.checkout}`;

  let features = offer.querySelector('.popup__features');
  features.innerHTML = '';
  let featureLi = document.createElement('li');
  featureLi.classList.add('popup__feature');

  for (let i = 0; i < data.offer.features.length; i++) {
    let featureItem = featureLi.cloneNode(true);
    featureItem.classList.add(`popup__feature--${data.offer.features[i]}`);
    features.append(featureItem);
  }

  offer.querySelector('.popup__description').textContent = data.offer.description;

  let photos = offer.querySelector('.popup__photos');
  let imgTpl = photos.firstElementChild.cloneNode(true);
  photos.innerHTML = '';

  for (let i = 0; i < data.offer.photos.length; i++) {
    let img = imgTpl.cloneNode(true);
    img.src = data.offer.photos[i];
    photos.append(img);
  }

  offer.querySelector('.popup__avatar').src = data.author.avatar;

  let map = document.querySelector('.map');
  let filters = map.querySelector('.map__filters-container');
  filters.before(offer);
}


var map = document.querySelector('.map');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var pinWidth = Math.floor(pinTemplate.offsetWidth);
var pinHeight = Math.floor(pinTemplate.offsetHeight);
var offerTemplate = document.querySelector('#card').content.querySelector('.map__card');
var adForm = document.querySelector('.ad-form');
var pinMainElement = document.querySelector('.map__pin--main');
var pinsContainerElement = map.querySelector('.map__pins');
var addressInput = document.querySelector('#address');
var isActive = false;

var PIN_MAIN_WIDTH = 65;
var PIN_MAIN_HEIGHT = 87;
var PIN_MAIN_X_MIN = 0
var PIN_MAIN_X_MAX = pinsContainerElement.offsetWidth;
var PIN_MAIN_Y_MIN = 130;
var PIN_MAIN_Y_MAX = 630;

var setAddressInput = function(x, y) {
  addressInput.value = `${x}, ${y}`;
}
var similar = getSimilar();

var activate = function() {

  if (isActive) {
    return;
  }

  isActive = true;

  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  adForm.querySelectorAll('fieldset:disabled').forEach(function(element) {
    element.disabled = false;
  });

  showPins(similar);
};

var movePin = function(x, y) {
  x = Math.max(x, 0);
  x = Math.min(x, PIN_MAIN_X_MAX);
  y = Math.max(y, PIN_MAIN_Y_MIN);
  y = Math.min(y, PIN_MAIN_Y_MAX);

  var posLeft = Math.round(x - (PIN_MAIN_WIDTH / 2));
  var posTop = Math.round(y - (PIN_MAIN_HEIGHT / 2));

  pinMainElement.style.left = posLeft + 'px';
  pinMainElement.style.top = posTop + 'px';
};

var calculateAddress = function(evt) {
  // координата курсора мыши относительно контейнера
  var coords = pinsContainerElement.getBoundingClientRect();
  var x = evt.pageX - (coords.left + pageXOffset);
  var y = evt.pageY - (coords.top + pageYOffset);

  x = Math.max(x, 0);
  x = Math.min(x, PIN_MAIN_X_MAX);
  y = Math.max(y, PIN_MAIN_Y_MIN);
  y = Math.min(y, PIN_MAIN_Y_MAX);

  // set default main pin
  setAddressInput(x, y);
};

var x = Math.round(pinsContainerElement.offsetWidth / 2);
var y = Math.round((pinsContainerElement.offsetHeight + PIN_MAIN_HEIGHT) / 2);

// set default main pin
setAddressInput(x, y);

var onMainPinMouseup = function(evt) {
  activate();
  calculateAddress(evt);
};

var onPinClick = function(evt) {
  var target = evt.target;
  var pin = target.closest('.map__pin');

  if (pin && !pin.classList.contains('map__pin--main')) {
    var offerId = pin.dataset.id;

    if (offerId && similar.hasOwnProperty(offerId)) {
      var offer = similar[offerId];
      showOffer(offer);
    }
  }
};

pinsContainerElement.addEventListener('click', onPinClick);
pinMainElement.addEventListener('mouseup', onMainPinMouseup);

var roomInput = document.querySelector('#room_number');
var capacityInput = document.querySelector('#capacity');

var onRoomInputChange = function(evt) {
  console.log(evt);
  var capacity = parseInt(capacityInput.value, 10);
  var roomNumber = parseInt(roomInput.value, 10);

  if (capacity > 0 && roomNumber < capacity) {
    roomInput.setCustomValidity('Кол-во комнат меньше кол-ва гостей.');
    roomInput.reportValidity();
  } else {
    roomInput.setCustomValidity('');
  }
};

roomInput.addEventListener('change', onRoomInputChange);
adForm.addEventListener('submit', onRoomInputChange);

