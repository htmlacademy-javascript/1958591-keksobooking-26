/* eslint-disable arrow-body-style */
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
 * @param {number} minValue - минимальное значение
 * @param {number} maxValue - максимальное значение
 * @returns {number} искомое число
 */

const getRandomInteger = (minValue, maxValue) => {
  const lower = Math.ceil(Math.min(Math.abs(minValue), Math.abs(maxValue)));
  const upper = Math.floor(Math.max(Math.abs(minValue), Math.abs(maxValue)));
  return Math.floor(Math.random() * (upper - lower + 1) + lower);
};

/**
 * Возвращает случайное число с плавающей точкой из переданного диапазона (включительно)
 * @param {number} minValue - минимальное значение
 * @param {number} maxValue - максимальное значение
 * @param {number} precision - количество знаков после запятой
 * @returns {number} искомое значение
 */

const getRandomFloat = (minValue, maxValue, precision) => {
  const lower = Math.min(Math.abs(minValue), Math.abs(maxValue));
  const upper = Math.max(Math.abs(minValue), Math.abs(maxValue));
  return parseFloat((Math.random() * (upper - lower) + lower).toFixed(precision));
};

/**
 * Возвращает случайный элемент из переданного массива
 * @param {массив} elements - массив значений
 * @returns - искомый элемент
 */

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

/**
 * Возвращает массив строк случайной длины из элементов переданного массива, элементы в строке не повторяются
 * @param {массив} elements - переданный массив значений
 * @returns - искомый массив строк
 */
const getRandomElements = (elements) => {
  const elementsAmount = getRandomInteger(1, elements.length);
  const shortElements = elements.slice();
  const randomElements = [];
  for (let i = 0; i < elementsAmount; i++) {
    const indexOfShortElements = getRandomInteger(1, shortElements.length - 1);
    randomElements.push(shortElements[indexOfShortElements]);
    shortElements.splice(indexOfShortElements, 1);
  }
  return randomElements;
};

/**
 *Возвращает строку - адрес изображения, содержащий порядковый номер объекта. Адреса не повторяются.
 *@param {number} accomodationNumber - порядковый номер объекта;
 *@returns - искомая строка
 */

const getAvatarAddress = (accomodationNumber) => (accomodationNumber < 10) ? `img/avatars/user0${accomodationNumber}.png` : `img/avatars/user${accomodationNumber}.png`;

/**
 *Возвращает объект author. Содержит одно поле - avatar.
 * @param {*} accomodationNumber - порядковый номер объекта;
 * @returns - искомый объект
 */

const createAuthor = (accomodationNumber) => {
  return {
    avatar: getAvatarAddress(accomodationNumber),
  };
};

/**
 *Возвращает объект offer.
 * @returns - искомый объект
 */

const createOffer = () => {
  return {
    title: getRandomArrayElement(TITLES),
    address: '',
    price: getRandomInteger(0, Number.MAX_VALUE),
    type: getRandomArrayElement(ACCOMODATION_TYPES),
    rooms: getRandomInteger(0, Number.MAX_VALUE),
    guests: getRandomInteger(0, Number.MAX_VALUE),
    checkin: getRandomArrayElement(CHECKINS),
    checkout: getRandomArrayElement(CHECKOUTS),
    features: getRandomElements(FEATURS),
    description: getRandomArrayElement(DESCRIPTIONS),
    photos: getRandomElements(PHOTOS),
  };
};

/**
 *Возвращает объект location.
 * @returns - искомый объект
 */

const createLocation = () => {
  return {
    lat: getRandomFloat(35.65000, 35.70000, 5),
    lng: getRandomFloat(139.70000, 139.80000, 5),
  };
};

/**
 *Возвращает объект accomodation.
 * @returns - искомый объект
 */

const createAccomodation = (accomodationNumber) => {
  return {
    author: createAuthor(accomodationNumber),
    offer: createOffer(),
    location: createLocation(),
  };
};

const accomodations = [];
for (let i = 0; i < ACCOMODATION_COUNT; i++) {
  accomodations.push(createAccomodation(i + 1));
  accomodations[i].offer.address = `${accomodations[i].location.lat} ${accomodations[i].location.lng}`;
}
