const ALERT_SHOW_TIME = 5000;
const RERENDER_DELAY = 500;

/**
 * Устраняет дребезг. Функция взята из материалов курса
 */
const debounce = (callback) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), RERENDER_DELAY);
  };
};

/**
 * Возвращает строку, содержащую переданное числительное + существительное в
 * правильной форме
 * @param {String} numeral - числительное
 * @param {Massive} nounCases - массив строк из трех значений - существительное в именительном падеже, родительном падеже, во множественном числе
 * @returns {String} - искомая строка
 */
const getNounCase = (numeral, nounCases) => {
  if (numeral !== undefined) {
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
  } else {
    return `неизвестное количество ${nounCases[2]}`;
  }
};

/**
 * Показывает блок с сообщением
 * Функция взята из материалов курса
 * @param {String} message - текст сообщения
 */
const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'absolute';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '30px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';
  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
};

/**
 * Возвращает строку для заполнения поля адрес
 * @param {Number}  latitude - широта
 * @param {Number}  longitude - долгота
 * @param {Number}  precision - число знаков после запятой
 */
const getAddress = (latitude, longitude, precision) => `${latitude.toFixed(precision)}, ${longitude.toFixed(precision)}`;

/**
 * Проверяет, что нажатая клавиша - Esc.
 */
const isEscapeKey = (evt) => evt.key === 'Escape';

/**
 * Обработчик для закрытия окна Success клавишей Esc
 */
const onSuccessElementEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    removeSuccessElement();
  }
};

/**
 * Очищает форму и фильтры, удаляет окно с сообщением об успехе и обработчик для закрытия окна клавишей Esc.
 */
function removeSuccessElement() {
  const successElement = document.querySelector('.success');
  const form = document.querySelector('.ad-form');
  const mapFilter = document.querySelector('.map__filters');
  form.reset();
  mapFilter.reset();
  successElement.remove();
  document.removeEventListener('keydown', onSuccessElementEscKeydown);
}

/**
 * Создает окно с сообщением об успехе. Устанавливает обработчики для закрытия окна.
 */
const createSuccessMessage = () => {
  const successMessageTemplate = document.querySelector('#success').content;
  const successMessageElement = successMessageTemplate.cloneNode(true);
  document.body.append(successMessageElement);
  const successElement = document.querySelector('.success');
  const onSuccessElementClick = () => {
    removeSuccessElement();
  };
  successElement.addEventListener('click', onSuccessElementClick);
  document.addEventListener('keydown', onSuccessElementEscKeydown);
};

/**
 * Обработчик для закрытия окна Error клавишей Esc
 */
const onErrorElementEscKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    removeErrorElement();
  }
};

/**
 * Удаляет окно с сообщением об ошибке и обработчик для закрытия окна клавишей Esc
 */
function removeErrorElement() {
  const errorElement = document.querySelector('.error');
  errorElement.remove();
  document.removeEventListener('keydown', onErrorElementEscKeydown);
}

/**
 * Создает окно с сообщением об ошибке. Устанавливает обработчики для закрытия окна
 */
const createErrorMessage = () => {
  const errorMessageTemplate = document.querySelector('#error').content;
  const errorMessageElement = errorMessageTemplate.cloneNode(true);
  document.body.append(errorMessageElement);
  const errorElement = document.querySelector('.error');
  const errorButton = document.querySelector('.error__button');
  errorElement.addEventListener('click', () => {
    removeErrorElement();
  });
  errorButton.addEventListener('click', () => {
    removeErrorElement();
  });
  document.addEventListener('keydown', onErrorElementEscKeydown);
};


export { getNounCase, showAlert, getAddress, createSuccessMessage, createErrorMessage, debounce };
