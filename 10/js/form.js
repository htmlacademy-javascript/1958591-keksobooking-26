import { getNounCase, createErrorMessage } from './util.js';
import { sendData } from './api.js';
import { getAddress } from './util.js';

const MAIN_LAT = 35.68941;
const MAIN_LNG = 139.69235;
const PRECISION = 5;

const MAX_ROOMS = 100;
const MIN_PRICE = 100000;
const MAX_PRICE = 100000;
const SLIDER_STEP = 500;

const Capacity = {
  1: ['1'],
  2: ['1', '2'],
  3: ['1', '2', '3'],
  100: ['0']
};

const MinPrice = {
  BUNGALOW: 0,
  FLAT: 1000,
  HOTEL: 3000,
  HOUSE: 5000,
  PALACE: 10000
};

const SampleForm = {
  AVATAR: 'img/muffin-grey.svg',
  ADDRESS: getAddress(MAIN_LAT, MAIN_LNG, PRECISION),
  TITLE: '',
  TIMEIN: '12:00',
  TIMEOUT: '12:00',
  ROOMS: '1',
  GUESTS: '3',
  PRICE: '',
  TYPE: 'flat',
  DESCRIPTION: '',
};

const form = document.querySelector('.ad-form');
const titleField = form.querySelector('#title');
const timeInField = form.querySelector('#timein');
const timeOutField = form.querySelector('#timeout');
const roomField = form.querySelector('#room_number');
const guestField = form.querySelector('#capacity');
const priceField = form.querySelector('#price');
const typeField = form.querySelector('#type');
const slider = form.querySelector('.ad-form__slider');
const submitButton = form.querySelector('.ad-form__submit');
const descriptionField = form.querySelector('#description');
const avatarField = form.querySelector('.ad-form-header__preview img');
const addressField = form.querySelector('#address');

const pristine = new Pristine(form, {
  classTo: 'ad-form__element',
  errorClass: 'ad-form__item--invalid',
  successClass: 'ad-form__item--valid',
  errorTextParent: 'ad-form__element',
  errorTextTag: 'span',
  errorTextClass: 'ad-form__error'
});

/**
 * Устанавливает слайдер
 */
const setSlider = () => {
  noUiSlider.create(slider, {
    range: {
      min: MIN_PRICE,
      max: MAX_PRICE,
    },
    start: MIN_PRICE,
    step: SLIDER_STEP,
    connect: 'lower',
    format: {
      to: (value) => value.toFixed(0),
      from: (value) => parseFloat(value),
    },
  });

  slider.noUiSlider.on('slide', () => {
    priceField.value = slider.noUiSlider.get();
    pristine.validate(priceField);
  });
};

/**
 * Переключает класс с модификатором --disabled у форм из массива FORMS,
 * переключает атрибут disable у их потомков, включает-выключает атрибут disable у слайдера.
 * @param {Boolean}  status - true для перевода в активный статус, false для перевода в неактивный
 */
const toggleFormStatus = (formSelector, status) => {
  const toggleForm = document.querySelector(`.${formSelector}`);
  if (status) {
    toggleForm.classList.remove(`${formSelector}--disabled`);
  } else {
    toggleForm.classList.add(`${formSelector}--disabled`);
  }

  const elements = Array.from(toggleForm.children);
  elements.forEach((element) => {
    element.disabled = !status;
  });

  if (formSelector === 'ad-form') {
    if (status) {
      slider.removeAttribute('disabled');
    } else {
      slider.setAttribute('disabled', true);
    }
  }
};

/**
 * Проверяет синхронизацию комнат и мест (поля поля room_number и capacity), правило описано в объекте Capacity
 * @returns {boolean} - возвращает true, если поля заполнены правильно
 */
const validateGuest = () => Capacity[roomField.value].includes(guestField.value);

/**
 * Возвращает текст сообщения об ошибке, если поля room_number и capacity заполнены неверно
 */
const getGuestErrorMessage = () => `${(roomField.value < MAX_ROOMS) && (guestField.value !== '0') ? `По нашим условиям в ${getNounCase(roomField.value, ['комнате', 'комнатах', 'комнатах'])} размещается не более ${getNounCase(roomField.value, ['гостя', 'гостей', 'гостей'])}` : '100 комнат не для гостей!'}`;

/**
 * Проверяет значение поля price - обязательное, в диапазоне от минимума до MAX_PRICE, где минимум
 * определяется полем type (тип жилья), правило записано в объекте MinPrice
 * @returns {boolean} - возвращает true, если поле заполнено правильно
 */
const validatePrice = () => priceField.value >= MinPrice[typeField.value.toUpperCase()] && priceField.value <= MAX_PRICE;

/**
 * Возвращает текст сообщения об ошибке, если поле price заполнено неверно
 */
const getPriceErrorMessage = () => `${priceField.value <= MAX_PRICE ? `Цена за ночь должна быть не меньше ${MinPrice[typeField.value.toUpperCase()]} руб.` : ''}`;

/**
 * Устанавливает валидаторы на поля формы.
 */
const setValidators = () => {

  pristine.addValidator(guestField, validateGuest, getGuestErrorMessage);
  /**
   * Вызывает валидацию поля Число гостей при изменения поля Число комнат.
   */
  const onRoomFieldChange = () => {
    pristine.validate(guestField);
  };
  roomField.addEventListener('change', onRoomFieldChange);
  pristine.addValidator(priceField, validatePrice, getPriceErrorMessage);

  /**
   * Устанавливает значение слайдера, если изменяется значение в поле цена
   */
  const onPriceFieldChange = () => {
    slider.noUiSlider.set(priceField.value);
  };
  priceField.addEventListener('input', onPriceFieldChange);

  /**
   * Меняет минимальное значение и плейсхолдер поля price при изменении значения в поле type, переустанавливает слайдер
   */
  const onTypeFieldChange = () => {
    priceField.placeholder = MinPrice[typeField.value.toUpperCase()];
    priceField.setAttribute('min', MinPrice[typeField.value.toUpperCase()]);
    slider.noUiSlider.updateOptions({
      range: {
        min: MinPrice[typeField.value.toUpperCase()],
        max: MAX_PRICE,
      },
      step: SLIDER_STEP
    });
    slider.noUiSlider.set(MinPrice[typeField.value.toUpperCase()]);
    slider.noUiSlider.set(priceField.value);
    pristine.validate(priceField);
  };
  typeField.addEventListener('change', onTypeFieldChange);

  /**
   * Синхронизирует время выезда
   */
  const onTimeInFieldChange = () => {
    timeOutField.value = timeInField.value;
  };
  timeInField.addEventListener('change', onTimeInFieldChange);

  /**
   * Синхронизирует время въезда
   */
  const onTimeOutFieldChange = () => {
    timeInField.value = timeOutField.value;
  };
  timeOutField.addEventListener('change', onTimeOutFieldChange);
};

/**
 * Блокирует кнопку Submit
 */
const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';
};

/**
 * Разблокирует кнопку Submit
 */
const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

/**
 * Устанавливает обработчик на Submit, который выполняет проверку данных, в случае успеха
 * отправляет данные на сервер
 * @param {} onSuccess - cb, выполняется при успехе
 */
const fulfilFormSubmit = (onSuccess) => {
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const isValid = pristine.validate();
    if (isValid) {
      blockSubmitButton();
      sendData(
        () => {
          onSuccess();
          unblockSubmitButton();
        },
        () => {
          createErrorMessage();
          unblockSubmitButton();
        },
        new FormData(evt.target),
      );
    }
  });
};

/**
 * Устанавливает обработчик на Reset, сбрасывает поля, сообщения валидатора
 */
const fulfilFormReset = (cb) => {
  form.addEventListener('reset', (evt) => {
    evt.preventDefault();
    avatarField.src = SampleForm.AVATAR;
    const photoField = form.querySelector('.ad-form__photo img');
    if (photoField !== null) {
      photoField.remove();
    }
    slider.noUiSlider.set(0);
    addressField.value = SampleForm.ADDRESS;
    titleField.value = SampleForm.TITLE;
    timeInField.value = SampleForm.TIMEIN;
    timeOutField.value = SampleForm.TIMEOUT;
    roomField.value = SampleForm.ROOMS;
    guestField.value = SampleForm.GUESTS;
    typeField.value = SampleForm.TYPE;
    priceField.value = SampleForm.PRICE;
    priceField.placeholder = MinPrice[typeField.value.toUpperCase()];
    descriptionField.value = SampleForm.DESCRIPTION;
    const featurefields = document.querySelectorAll('.features__checkbox');
    featurefields.forEach((feature) => { feature.checked = false; });
    pristine.reset();
    cb();
  });
};

/**
 * Устанавливает обработчик на выбор фильтра
 */
const setHandlerOnMapFilter = (cb) => {
  const mapFilter = document.querySelector('.map__filters');
  mapFilter.addEventListener('change', () => {
    cb();
  });
};

export { toggleFormStatus, setSlider, setValidators, fulfilFormSubmit, setHandlerOnMapFilter, fulfilFormReset };

