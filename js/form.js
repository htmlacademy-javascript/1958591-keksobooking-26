import { getNounCase, createErrorMessage } from './util.js';
import { sendData } from './api.js';
//import { mainMarker } from './map.js';

const MAX_ROOMS = 100;
const MAX_PRICE = 100000;

const Capacity = {
  1: ['1'],
  2: ['1', '2'],
  3: ['1', '2', '3'],
  100: ['0']
};

const MinPrice = {
  bungalow: 0,
  flat: 1000,
  hotel: 3000,
  house: 5000,
  palace: 10000
};

const form = document.querySelector('.ad-form');
//const titleField = form.querySelector('#title');
const timeInField = form.querySelector('#timein');
const timeOutField = form.querySelector('#timeout');
const roomField = form.querySelector('#room_number');
const guestField = form.querySelector('#capacity');
const priceField = form.querySelector('#price');
const typeField = form.querySelector('#type');
const sliderElement = form.querySelector('.ad-form__slider');
const submitButton = form.querySelector('.ad-form__submit');
//const resetButton = form.querySelector('.ad-form__reset');
//const descriptionField = form.querySelector('#description');

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
  noUiSlider.create(sliderElement, {
    range: {
      min: 0,
      max: 100000,
    },
    start: 0,
    step: 500,
    connect: 'lower',
    format: {
      to: (value) => value.toFixed(0),
      from: (value) => parseFloat(value),
    },
  });

  sliderElement.noUiSlider.on('slide', () => {
    priceField.value = sliderElement.noUiSlider.get();
  });
};

/**
 * Переключает класс с модификатором --disabled у форм из массива FORMS,
 * переключает атрибут disable у их потомков, включает-выключает атрибут disable у слайдера.
 * @param {Boolean}  status - true для перевода в активный статус, false для перевода в неактивный
 */
const toggleStatus = (formSelector, status) => {
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
      sliderElement.removeAttribute('disabled');
    } else {
      sliderElement.setAttribute('disabled', true);
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
const validatePrice = () => priceField.value >= MinPrice[typeField.value] && priceField.value <= MAX_PRICE;

/**
 * Возвращает текст сообщения об ошибке, если поле price заполнено неверно
 */
const getPriceErrorMessage = () => `${priceField.value <= MAX_PRICE ? `Цена за ночь должна быть не меньше ${MinPrice[typeField.value]} руб.` : ''}`;

/**
 * Устанавливает валидаторы на поля формы.
 */
const setValidators = () => {

  pristine.addValidator(guestField, validateGuest, getGuestErrorMessage);
  /**
   * Вызывает валидацию поля Число гостей при изменения поля Число комнат.
   */
  const onRoomChange = () => {
    pristine.validate(guestField);
  };
  roomField.addEventListener('change', onRoomChange);

  pristine.addValidator(priceField, validatePrice, getPriceErrorMessage);

  /**
   * Устанавливает значение слайдера, если изменяется значение в поле цена
   */
  const onPriceChange = () => {
    sliderElement.noUiSlider.set(priceField.value);
  };
  priceField.addEventListener('input', onPriceChange);

  /**
   * Меняет минимальное значение и плейсхолдер поля price при изменении значения в поле type, переустанавливает слайдер
   */
  const onTypeChange = () => {
    priceField.placeholder = MinPrice[typeField.value];
    priceField.setAttribute('min', MinPrice[typeField.value]);
    sliderElement.noUiSlider.updateOptions({
      range: {
        min: MinPrice[typeField.value],
        max: 100000,
      },
      step: 500
    });
    sliderElement.noUiSlider.set(MinPrice[typeField.value]);
    sliderElement.noUiSlider.set(priceField.value);
    pristine.validate(priceField);
  };

  typeField.addEventListener('change', onTypeChange);

  /**
   * Синхронизирует время выезда
   */
  const onTimeInChange = () => {
    timeOutField.value = timeInField.value;
  };
  timeInField.addEventListener('change', onTimeInChange);

  /**
   * Синхронизирует время въезда
   */
  const onTimeOutChange = () => {
    timeInField.value = timeOutField.value;
  };
  timeOutField.addEventListener('change', onTimeOutChange);
};

const blockSubmitButton = () => {

  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';
};
const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

const setFormSubmit = (onSuccess) => {
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const isValid = pristine.validate();
    if (isValid) {
      blockSubmitButton();
      sendData(
        () => {
          onSuccess();
          //Здесь очистка формы
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

export { toggleStatus, setSlider, setValidators, setFormSubmit };

