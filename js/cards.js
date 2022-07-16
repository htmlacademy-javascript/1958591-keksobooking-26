import { getNounCase } from './util.js';

const AccommodationType = {
  BUNGALOW: 'Бунгало',
  FLAT: 'Квартира',
  HOTEL: 'Отель',
  HOUSE: 'Дом',
  PALACE: 'Дворец'
};

/**
 * Заполняет указанное свойство переданного элемента *
 * @param {Object} elementParent - текущий DOM-элемент (родитель)
 * @param {String} сhildSelector - селектор элемента (ребенка), куда помещаются данные
 * @param {String} childProperty - заполняемое свойство ('src' или 'textContent')
 * @param {Array} childFields - поля объекта с данными для проверки (определены эти поля с данными или нет)
 * @param {Array} childContent - строка с адресом картинки или текстовая строка для свойства textContent
 */
const fillContent = (elementParent, сhildSelector, childProperty, childFields, childContent) => {
  let checkFields = true;
  childFields.forEach((childField) => {
    if (childField === undefined) {
      checkFields = false;
    }
  });
  if (checkFields === false) {
    elementParent.querySelector(сhildSelector).remove();
  } else {
    elementParent.querySelector(сhildSelector)[childProperty] = childContent;
  }
};

/**
 * Помещает картинки из переданного массива (если он определен) в шаблон с данными,
 * создает в шаблоне дополнительную разметку для картинок, если их больше, чем одна.
 * Если картинок нет, скрывает контейнер картинок
 * @param {Object} element - текущий DOM-элемент
 * @param {String} selectorContainer - селектор контейнера картинок
 * @param {String} selectorPicture - селектор картинки
 * @param {Array} pictures - массив картинок
 */
const fillPictures = (element, selectorContainer, selectorPicture, pictures) => {

  if (pictures === undefined) {
    element.querySelector(selectorContainer).remove();
  } else {
    pictures.forEach((picture, index) => {
      const photoList = element.querySelector(selectorContainer);
      const photoItem = photoList.querySelector(selectorPicture);
      if (index === 0) {
        photoItem.src = picture;
      }
      else {
        const photoItemAdditional = photoItem.cloneNode(true);
        photoItemAdditional.src = picture;
        photoList.append(photoItemAdditional);
      }
    });
  }
};

/**
 * Удаляет лишние элементы из контейнера - оставляет только те элементы, имена которых есть в переданном массиве
 * Если переданный массив неопределен, скрывает контейнер
 * @param {Object} element - текущий DOM-элемент
 * @param {String} selectorContainer - селектор контейнера
 * @param {String} selectorItem - селектор элемента
 * @param {Array} itemNames - массив имен элементов
 */
const removeSpareItems = (element, selectorContainer, selectorItem, itemNames) => {
  if (itemNames === undefined) {
    element.querySelector(selectorContainer).remove();
  } else {
    const container = element.querySelector(selectorContainer);
    const list = container.querySelectorAll(selectorItem);

    list.forEach((item) => {
      const isAvailable = itemNames.some(
        (itemName) => item.classList.contains(`${selectorItem.substring(1)}--${itemName}`),
      );

      if (!isAvailable) {
        item.remove();
      }
    });
  }
};

/**
 * Возвращает строку для заполнения элемента шаблона '.popup__text--price'
 * @param {String} price - прайс
 * @returns {String} - искомая строка
 */
const getPrice = (price) => `${price}  ₽/ночь`;

/**
 * Возвращает строку для заполнения элемента шаблона '.popup__text--сapacity'
 * @param {String} rooms - число комнат
 * @param {String} guests - число гостей
 * @returns {String} - искомая строка
 */
const getCapacity = (rooms, guests) => `${getNounCase(rooms, ['комната', 'комнаты', 'комнат'])} для ${getNounCase(guests, ['гостя', 'гостей', 'гостей'])}`;

/**
 * Возвращает строку для заполнения элемента шаблона '.popup__text--time'
 * @param {String} checkin - время заезда
 * @param {String} checkout - время выезда
 * @returns {String} - искомая строка
 */
const getTime = (checkin, checkout) => `Заезд после ${checkin}, выезд до ${checkout}`;

/**
 * Возвращает строку для заполнения элемента шаблона '.popup__type'
 * @param {String} type - тип жилья
 * @returns {String} - искомая строка
 */
const getType = (type) => AccommodationType[type.toUpperCase()];

/**
 *Создает необходимое количество DOM-элементов и заполняет их данными заранее подготовленного массива объектов
 * @param {Array} accomodationCards - массив объектов с данными для заполнения DOM-элементов
 */
const createAccomodationPopup = ({ offer, author }) => {
  const cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.popup');
  const accomodationElement = cardTemplate.cloneNode(true);
  fillContent(accomodationElement, '.popup__title', 'textContent', [offer.title], offer.title);
  fillContent(accomodationElement, '.popup__text--address', 'textContent', [offer.address], offer.address);
  fillContent(accomodationElement, '.popup__text--price', 'textContent', [offer.price], getPrice(offer.price));
  fillContent(accomodationElement, '.popup__text--capacity', 'textContent', [], getCapacity(offer.rooms, offer.guests));
  fillContent(accomodationElement, '.popup__text--time', 'textContent', [offer.checkin, offer.checkout], getTime(offer.checkin, offer.checkout));
  fillContent(accomodationElement, '.popup__description', 'textContent', [offer.description], offer.description);
  fillContent(accomodationElement, '.popup__avatar', 'src', [author.avatar], author.avatar);
  fillContent(accomodationElement, '.popup__type', 'textContent', [offer.type], getType(offer.type));

  fillPictures(accomodationElement, '.popup__photos', '.popup__photo', offer.photos);
  removeSpareItems(accomodationElement, '.popup__features', '.popup__feature', offer.features);

  return accomodationElement;
};

export { createAccomodationPopup };

