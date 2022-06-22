import { createAccomodations } from './mocks/data.js';

const getAccommodationType = (accommodationType) => {
  switch (accommodationType) {
    case 'bungalow':
      return 'Бунгало';
    case 'flat':
      return 'Квартира';
    case 'hotel':
      return 'Отель';
    case 'house':
      return 'Дом';
    case 'palace':
      return 'Дворец';
    default:
      return 'Отель';
  }
};

const getRoomCase = (rooms) => {
  switch (rooms) {
    case 1:
      return 'комната';
    case 2:
      return 'комнаты';
    case 3:
      return 'комнаты';
    case 4:
      return 'комнаты';
    default:
      return 'комнат';
  }
};

const getGuestCase = (guests) => {
  switch (guests) {
    case 1:
      return 'гостя';
    default:
      return 'гостей';
  }
};

const hideBlock = (element, selector, key) => {
  if (key === undefined) {
    element.querySelector(selector).classList.add('visually-hidden');
    return true;
  }
  return false;
};

const createAccomodationCards = (cardAmount) => {
  const placeForCards = document.querySelector('#map-canvas');
  const cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.popup');

  const accomodationCards = createAccomodations(cardAmount);
  const accomodationCardFragment = document.createDocumentFragment();

  accomodationCards.forEach(({ offer, author }, accomodationIndex) => {
    const accomodationElement = cardTemplate.cloneNode(true);
    if (!hideBlock(accomodationElement, '.popup__title', offer.title)) {
      accomodationElement.querySelector('.popup__title').textContent = offer.title;
    }
    if (!hideBlock(accomodationElement, '.popup__text--address', offer.address)) {
      accomodationElement.querySelector('.popup__text--address').textContent = offer.address;
    }
    if (!hideBlock(accomodationElement, '.popup__text--price', offer.price)) {
      accomodationElement.querySelector('.popup__text--price').textContent = `${offer.price}  ₽/ночь`;
    }
    if (!hideBlock(accomodationElement, '.popup__text--capacity', offer.rooms) || !hideBlock(accomodationElement, '.popup__text--capacity', offer.guests)) {
      accomodationElement.querySelector('.popup__text--capacity').textContent = `${offer.rooms} ${getRoomCase(offer.rooms)} для ${offer.guests} ${getGuestCase(offer.guests)}`;
    }
    if (!hideBlock(accomodationElement, '.popup__text--time', offer.checkin) || !hideBlock(accomodationElement, '.popup__text--time', offer.checkout)) {
      accomodationElement.querySelector('.popup__text--time').textContent = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`;
    }
    if (!hideBlock(accomodationElement, '.popup__description', offer.description)) {
      accomodationElement.querySelector('.popup__description').textContent = offer.description;
    }

    accomodationElement.querySelector('.popup__avatar').src = author.avatar;

    accomodationElement.querySelector('.popup__type').textContent = getAccommodationType(offer.type);

    if (!hideBlock(accomodationElement, '.popup__photos', offer.photos)) {
      offer.photos.forEach((photos, index) => {
        const photoList = accomodationElement.querySelector('.popup__photos');
        const photoItem = accomodationElement.querySelector('.popup__photo');
        if (index === 0) {
          photoItem.src = photos;
        }
        else {
          const photoItemAdditional = photoItem.cloneNode(true);
          photoItemAdditional.src = photos;
          photoList.append(photoItemAdditional);
        }
      });
    }

    if (!hideBlock(accomodationElement, '.popup__features', offer.features)) {
      const userFeatures = offer.features;
      const featureContainer = accomodationElement.querySelector('.popup__features');
      const featureList = featureContainer.querySelectorAll('.popup__feature');

      featureList.forEach((featureItem) => {
        const isAvailable = userFeatures.some(
          (userFeature) => featureItem.classList.contains(`popup__feature--${userFeature}`),
        );

        if (!isAvailable) {
          featureItem.remove();
        }
      });
    }

    if (accomodationIndex !== 0) { accomodationElement.classList.add('visually-hidden'); }
    accomodationCardFragment.appendChild(accomodationElement);
  });

  placeForCards.appendChild(accomodationCardFragment);
};

export { createAccomodationCards };
