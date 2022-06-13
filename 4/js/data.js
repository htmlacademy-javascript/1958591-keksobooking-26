import { getRandomInteger } from './util.js';
import { getRandomFloat } from './util.js';
import { getRandomArrayElement } from './util.js';
import { getRandomElements } from './util.js';
import { generateAccomodationNumber } from './util.js';

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

const ACCOMODATION_COUNT = 10;

/**
 *Возвращает объект accomodation.
 * @returns {Object} - искомый объект
 */
const getAccomodation = () => {
  const accomodationNumber = generateAccomodationNumber();
  const randomLat = getRandomFloat(35.65000, 35.70000, 5);
  const randomLng = getRandomFloat(139.70000, 139.80000, 5);
  return {
    author: {
      avatar: `img/avatars/user${(accomodationNumber < 10) ? `0${accomodationNumber}` : accomodationNumber}.png`,
    },
    offer: {
      title: getRandomArrayElement(TITLES),
      address: `${randomLat} ${randomLng}`,
      price: getRandomInteger(0, Number.MAX_VALUE),
      type: getRandomArrayElement(ACCOMODATION_TYPES),
      rooms: getRandomInteger(0, Number.MAX_VALUE),
      guests: getRandomInteger(0, Number.MAX_VALUE),
      checkin: getRandomArrayElement(CHECKINS),
      checkout: getRandomArrayElement(CHECKOUTS),
      features: getRandomElements(FEATURS),
      description: getRandomArrayElement(DESCRIPTIONS),
      photos: getRandomElements(PHOTOS),
    },
    location: {
      lat: randomLat,
      lng: randomLng,
    },
  };
};

/**
 *Возвращает массив объектов заданной длины. Объекты создаются с помощью  callback-функции getAccomodation.
 */
const createAccomodations = () => Array.from({ length: ACCOMODATION_COUNT }, getAccomodation);

export { createAccomodations };

