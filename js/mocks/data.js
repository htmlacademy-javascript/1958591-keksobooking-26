import { getRandomInteger, getRandomFloat, getRandomArrayElement, getRandomElements, generateAccomodationNumber } from './util.js';

const TITLES = [
  'Комфортабельное проживание в красивом районе',
  'Удобное проживание рядом с транспортными развязками',
  'Превосходный вариант для семейных пар',
  'Удобный вариант для активных путешественников',
  'Удачный вариант для любителей культуры и искусства',
  'Превосходное размещение, домашние питомцы приветствуются',
];

const DESCRIPTIONS = [
  'Замечательное расположение - тихий район, тенистый сквер и детская площадка.',
  'Предложение подходит активным молодым людям, любящим громкую музыку и прогулки по ночам.',
  'Удобная транспортная развязка, легко добраться в любую точку города.',
  'В пешей доступности музей, кинотеатр и супермаркет.',
  'Наш девиз -  комфорт, чистота и удобство.',
  'К сожалению, мы не размещаем гостей с домашними питомцами.',
  'В пешей доступности бассейн и превосходный спортивный комплекс',
];

const ACCOMODATION_TYPES = [
  'palace',
  'flat',
  'house',
  'bungalow',
  'hotel',
];

const CHECKINS = [
  '12:00',
  '13:00',
  '14:00',
];

const CHECKOUTS = [
  '12:00',
  '13:00',
  '14:00',
];

const FEATURS = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner',
];

const PHOTOS = [
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/duonguyen-8LrGtIxxa4w.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/brandon-hoogenboom-SNxQGWxZQi0.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/claire-rendall-b6kAwr1i0Iw.jpg',
];

const Location = {
  LAT_MIN: 35.65000,
  LAT_MAX: 35.70000,
  LNG_MIN: 139.70000,
  LNG_MAX: 139.80000,
  DIGIT: 5
};

const MIN_PRICE = 0;
const MAX_PRICE = 10000;

const MIN_GUESTS = 1;
const MAX_GUESTS = 3;

const MIN_ROOMS = 1;
const MAX_ROOMS = 5;


/**
 *Возвращает объект accomodation.
 * @returns {Object} - искомый объект
 */
const getAccomodation = () => {
  const accomodationNumber = generateAccomodationNumber();

  const location = {
    lat: getRandomFloat(Location.LAT_MIN, Location.LAT_MAX, Location.DIGIT),
    lng: getRandomFloat(Location.LNG_MIN, Location.LNG_MAX, Location.DIGIT)
  };

  return {
    author: {
      avatar: `img/avatars/user${(accomodationNumber < 10) ? `0${accomodationNumber}` : accomodationNumber}.png`,
    },
    offer: {
      title: getRandomArrayElement(TITLES),
      address: `${location.lat} ${location.lng}`,
      price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      type: getRandomArrayElement(ACCOMODATION_TYPES),
      rooms: getRandomInteger(MIN_ROOMS, MAX_ROOMS),
      guests: getRandomInteger(MIN_GUESTS, MAX_GUESTS),
      checkin: getRandomArrayElement(CHECKINS),
      checkout: getRandomArrayElement(CHECKOUTS),
      features: getRandomElements(FEATURS),
      description: getRandomArrayElement(DESCRIPTIONS),
      photos: getRandomElements(PHOTOS),
    },
    location
  };
};

/**
 *Возвращает массив объектов заданной длины. Объекты создаются с помощью  callback-функции getAccomodation.
 */
const createAccomodations = (accomodationAmount) => Array.from({ length: accomodationAmount }, getAccomodation);

export { createAccomodations };

