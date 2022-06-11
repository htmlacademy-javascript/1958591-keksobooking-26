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
 * Возвращает случайное целое число из переданного диапазона (включительно)
 * @param {Number} minValue - минимальное значение
 * @param {Number} maxValue - максимальное значение
 * @returns {Number} - искомое число
 */
const getRandomInteger = (minValue, maxValue) => {
  const lower = Math.ceil(Math.min(Math.abs(minValue), Math.abs(maxValue)));
  const upper = Math.floor(Math.max(Math.abs(minValue), Math.abs(maxValue)));
  return Math.floor(Math.random() * (upper - lower + 1) + lower);
};

/**
 * Возвращает случайное число с плавающей точкой из переданного диапазона (включительно)
 * @param {Number} minValue - минимальное значение
 * @param {Number} maxValue - максимальное значение
 * @param {Number} precision - количество знаков после запятой
 * @returns {Number} - искомое значение
 */
const getRandomFloat = (minValue, maxValue, precision) => {
  const lower = Math.min(Math.abs(minValue), Math.abs(maxValue));
  const upper = Math.max(Math.abs(minValue), Math.abs(maxValue));
  return parseFloat((Math.random() * (upper - lower) + lower).toFixed(precision));
};

/**
 * Возвращает случайный элемент из переданного массива
 * @param {Array} elements - переданный массив значений
 * @returns {String} - искомый случайный элемент
 */
const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

/**
 * Возвращает массив строк случайной длины из элементов переданного массива, элементы в массиве не повторяются
 * @param {Array} elements - переданный массив значений
 * @returns {Array} - новый массив (случайные значения из исходного массива)
 */
const getRandomElements = (elements) => {
  const elementsAmount = getRandomInteger(1, elements.length);
  const shortElements = elements.slice();
  const randomElements = [];
  for (let i = 0; i < elementsAmount; i++) {
    const indexOfShortElements = getRandomInteger(0, shortElements.length - 1);
    randomElements.push(shortElements[indexOfShortElements]);
    shortElements.splice(indexOfShortElements, 1);
  }
  return randomElements;
};

/**
 *Возвращает строку - адрес изображения, содержащий порядковый номер объекта. Адреса не повторяются.
 *@param {Number} accomodationNumber - порядковый номер объекта.
 *@returns {String} - искомая строка.
 */
const getAvatarAddress = (accomodationNumber) => `img/avatars/user${(accomodationNumber < 10) ? `0${accomodationNumber}` : accomodationNumber}.png`;

/**
 *Возвращает объект accomodation.
 * @param {Number} accomodationNumber - порядковый номер объекта.
 * @param {Number} locationLat - географическая широта объекта.
 * @param {Number} locationLng - географическая долгота объекта.
 * @returns {Object} - искомый объект
 */
const getAccomodation = (accomodationNumber, locationLat, locationLng) => ({
  author: {
    avatar: getAvatarAddress(accomodationNumber),
  },
  offer: {
    title: getRandomArrayElement(TITLES),
    address: `${locationLat} ${locationLng}`,
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
    lat: locationLat,
    lng: locationLng,
  },
});

/**
 *Возвращает массив объектов.
 * @param {Number} accomodationsAmount - число объектов в массиве.
 * @returns {Array} accomodations - искомый массив объектов
 */
const createAccomodations = (accomodationsAmount) => {
  const accomodations = [];
  for (let i = 0; i < accomodationsAmount; i++) {
    const randomLat = getRandomFloat(35.65000, 35.70000, 5);
    const randomLng = getRandomFloat(139.70000, 139.80000, 5);
    accomodations.push(getAccomodation((i + 1), randomLat, randomLng));
  }
  return accomodations;
};

createAccomodations(ACCOMODATION_COUNT);
