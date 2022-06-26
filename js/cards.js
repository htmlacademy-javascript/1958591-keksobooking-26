const AccommodationType = {
  BUNGALOW: 'Бунгало',
  FLAT: 'Квартира',
  HOTEL: 'Отель',
  HOUSE: 'Дом',
  PALACE: 'Дворец'
};

/**
 * Возвращает строку, содержащую переданное числительное + существительное в
 *  правильной форме
 * @param {String} numeral - числительное
 * @param {Massive} nounCases - массив строк из трех значений - существительное в именительном падеже, родительном падеже, во множественном числе
 * @returns {String} - искомая строка
 */
const getNounCase = (numeral, nounCases) => {
  const twoDigitNumber = numeral.toString().substring(numeral.toString().length - 2);
  const oneDigitNumber = numeral.toString().substring(numeral.toString().length - 1);
  if ((twoDigitNumber > 10) && (twoDigitNumber < 15)) {
    return `${numeral} ${nounCases[2]}`;
  }
  switch (oneDigitNumber) {
    case '1':
      return `${numeral} ${nounCases[0]}`;
    case '2':
      return `${numeral} ${nounCases[1]}`;
    case '3':
      return `${numeral} ${nounCases[1]}`;
    case '4':
      return `${numeral} ${nounCases[1]}`;
    default:
      return `${numeral} ${nounCases[2]}`;
  }
};

/**
 * Заполняет указанное свойство переданного элемента *
 * @param {Object} elementParent - текущий DOM-элемент (родитель)
 * @param {String} сhildSelector - селектор элемента (ребенка), куда помещаются данные
 * @param {String} childProperty - заполняемое свойство ('src' или 'textContent')
 * @param {Array} childFields - поля объекта с данными для проверки (определены эти поля с данными или нет)
 * @param {Array} childContent - строка с адресом картинки или текстовая строка для свойства textContent
 */
const makeContent = (elementParent, сhildSelector, childProperty, childFields, childContent) => {
  childFields.forEach((childField) => {
    if (childField === undefined) {
      elementParent.querySelector(сhildSelector).classList.add('hidden');
      return false;
    }
  });
  elementParent.querySelector(сhildSelector)[childProperty] = childContent;
};

/**
 * Помещает картинки из переданного массива (если он определен) в шаблон с данными,
 * создает в шаблоне дополнительную разметку для картинок, если их больше, чем одна
 * @param {Object} element - текущий DOM-элемент
 * @param {String} selectorContainer - селектор контейнера картинок
 * @param {String} selectorPicture - селектор картинки
 * @param {Array} pictures - массив картинок
 */
const fillPictures = (element, selectorContainer, selectorPicture, pictures) => {

  if (pictures === undefined) {
    element.querySelector(selectorContainer).classList.add('hidden');
    return false;
  }
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
};

/**
 * Удаляет лишние элементы из контейнера - оставляет только те элементы, имена которых есть в переданном массиве
 * @param {Object} element - текущий DOM-элемент
 * @param {String} selectorContainer - селектор контейнера
 * @param {String} selectorItem - селектор элемента
 * @param {Array} itemNames - массив имен элементов
 */
const removeSpareFeatures = (element, selectorContainer, selectorItem, itemNames) => {

  if (itemNames === undefined) {
    element.querySelector(selectorContainer).classList.add('hidden');
    return false;
  }

  const featureContainer = element.querySelector(selectorContainer);
  const featureList = featureContainer.querySelectorAll(selectorItem);

  featureList.forEach((featureItem) => {
    const isAvailable = itemNames.some(
      (itemName) => featureItem.classList.contains(`${selectorItem.substring(1)}--${itemName}`),
    );

    if (!isAvailable) {
      featureItem.remove();
    }
  });

};

/**
 *Создает необходимое количество DOM-элементов и заполняет их данными заранее подготовленного массива объектов
 * @param {Array} accomodationCards - массив объектов с данными для заполнения DOM-элементов
 */
const createAccomodationCards = (accomodationCards) => {
  const placeForCards = document.querySelector('#map-canvas');
  const cardTemplate = document.querySelector('#card')
    .content
    .querySelector('.popup');

  const accomodationCardFragment = document.createDocumentFragment();

  accomodationCards.forEach(({ offer, author }, accomodationIndex) => {
    const accomodationElement = cardTemplate.cloneNode(true);
    makeContent(accomodationElement, '.popup__title', 'textContent', [offer.title], offer.title);
    makeContent(accomodationElement, '.popup__text--address', 'textContent', [offer.address], offer.address);

    let propertyContent = `${offer.price}  ₽/ночь`;
    makeContent(accomodationElement, '.popup__text--price', 'textContent', [offer.price], propertyContent);

    propertyContent = `${getNounCase(offer.rooms, ['комната', 'комнаты', 'комнат'])} для ${getNounCase(offer.guests, ['гостя', 'гостей', 'гостей'])}`;
    makeContent(accomodationElement, '.popup__text--capacity', 'textContent', [offer.rooms, offer.guests], propertyContent);

    propertyContent = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`;
    makeContent(accomodationElement, '.popup__text--time', 'textContent', [offer.checkin, offer.checkout], propertyContent);
    makeContent(accomodationElement, '.popup__description', 'textContent', [offer.description], offer.description);
    makeContent(accomodationElement, '.popup__avatar', 'src', [author.avatar], author.avatar);

    propertyContent = AccommodationType[offer.type.toUpperCase()];
    makeContent(accomodationElement, '.popup__type', 'textContent', [offer.type], propertyContent);

    fillPictures(accomodationElement, '.popup__photos', '.popup__photo', offer.photos);
    removeSpareFeatures(accomodationElement, '.popup__features', '.popup__feature', offer.features);

    if (accomodationIndex !== 0) { accomodationElement.classList.add('hidden'); }
    accomodationCardFragment.appendChild(accomodationElement);
  });

  placeForCards.appendChild(accomodationCardFragment);
};

export { createAccomodationCards };
