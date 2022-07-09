import { getNounCase, showAlert, createAccomodationPopup } from './cards.js';
import { sendData } from './api.js';

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

const mainPinIcon = L.icon({
  iconUrl: './img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [13, 26],
});

const pinIcon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [10, 20],
});

const MAIN_LAT = 35.68941;
const MAIN_LNG = 139.69235;
const PRECISION = 5;
const SCALE = 12;

/**
 * Устанавливает слайдер
 */
const setSlider = () => {
  const sliderElement = document.querySelector('.ad-form__slider');
  const priceInpute = document.querySelector('#price');
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
    priceInpute.value = sliderElement.noUiSlider.get();
  });
};

/**
 * Переключает класс с модификатором --disabled у форм из массива FORMS,
 * переключает атрибут disable у их потомков, включает-выключает атрибут disable у слайдера.
 * @param {Boolean}  status - true для перевода в активный статус, false для перевода в неактивный
 */
const toggleStatus = (formSelector, status) => {
  const sliderElement = document.querySelector('.ad-form__slider');

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
 * Устанавливает валидаторы на поля формы.
 */
const setValidators = (onSuccess) => {
  const form = document.querySelector('.ad-form');
  const timeInField = form.querySelector('#timein');
  const timeOutField = form.querySelector('#timeout');
  const roomField = form.querySelector('#room_number');
  const guestField = form.querySelector('#capacity');
  const priceField = form.querySelector('#price');
  const typeField = form.querySelector('#type');
  const sliderElement = document.querySelector('.ad-form__slider');

  const pristine = new Pristine(form, {
    classTo: 'ad-form__element',
    errorClass: 'ad-form__item--invalid',
    successClass: 'ad-form__item--valid',
    errorTextParent: 'ad-form__element',
    errorTextTag: 'span',
    errorTextClass: 'ad-form__error'
  });

  /**
   * Проверяет синхронизацию комнат и мест (поля поля room_number и capacity), правило описано в объекте Capacity
   * @returns {boolean} - возвращает true, если поля заполнены правильно
   */
  const validateGuest = () => Capacity[roomField.value].includes(guestField.value);

  /**
   * Возвращает текст сообщения об ошибке, если поля room_number и capacity заполнены неверно
   */
  const getGuestErrorMessage = () => `${(roomField.value < MAX_ROOMS) && (guestField.value !== '0') ? `По нашим условиям в ${getNounCase(roomField.value, ['комнате', 'комнатах', 'комнатах'])} размещается не более ${getNounCase(roomField.value, ['гостя', 'гостей', 'гостей'])}` : '100 комнат не для гостей!'}`;

  pristine.addValidator(guestField, validateGuest, getGuestErrorMessage);

  /**
   * Вызывает валидацию поля Число гостей при изменения поля Число комнат.
   */
  const onRoomChange = () => {
    pristine.validate(guestField);
  };
  roomField.addEventListener('change', onRoomChange);

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
  pristine.addValidator(priceField, validatePrice, getPriceErrorMessage);

  /**
   * Устанавливает значение слайдера, если изменяется значение в поле цена
   */
  const onPriceChange = () => {
    sliderElement.noUiSlider.set(priceField.value);
  };
  priceField.addEventListener('input', onPriceChange);

  /**
   * Меняет минимальное значение и плейсхолдер поля price при изменении значения в поле type
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
   * Проверяет синхронизацию полей timein и timeout (время заезда - выезда должно быть равно)
   * @returns {boolean} - возвращает true, если поля заполнены правильно
   */
  //const validateTime = () => timeInField.value === timeOutField.value;

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

  /**
    * Возвращает строку для заполнения поля адрес
    * @param {Number}  latitude - широта
    *
    */
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const isValid = pristine.validate();
    if (isValid) {
      sendData(
        () => onSuccess(),
        () => showAlert('Не удалось отправить форму. Попробуйте ещё раз'),
        new FormData(evt.target),
      );

      // const formData = new FormData(evt.target);
      // //form.submit();
      // fetch(
      //   'https://26.javascript.pages.academy/keksobooking',
      //   {
      //     method: 'POST',
      //     body: formData,
      //   },
      // )
      //   .then((response) => {
      //     if (response.ok) {
      //       //onSuccess();
      //       alert('успех')
      //     } else {
      //       showAlert('Не удалось отправить форму. Попробуйте ещё раз');
      //     }
      //   })
      //   .catch(() => {
      //     showAlert('Не удалось отправить форму. Попробуйте ещё раз');
      //   });
    }
  });
};


/**
 * Возвращает строку для заполнения поля адрес
 * @param {Number}  latitude - широта
 * @param {Number}  longitude - долгота
 * @param {Number}  precision - число знаков после запятой
 */
const getAddress = (latitude, longitude, precision) => `${latitude.toFixed(precision)}, ${longitude.toFixed(precision)}`;

/**
* Инициализирует карту и главный маркер, отображает адрес в соответствующем поле. Возвращает ссылку на карту
* @return {Object} map - ссылка на карту
*/
const createMap = () => {
  const map = L.map('map-canvas')
    .on('load', () => {
      toggleStatus('ad-form', true);
    })

    .setView({
      lat: MAIN_LAT,
      lng: MAIN_LNG,
    }, SCALE);

  L.tileLayer(
    'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  ).addTo(map);

  const addressField = document.querySelector('#address');
  addressField.value = getAddress(MAIN_LAT, MAIN_LNG, PRECISION);
  const mainMarker = L.marker(
    {
      lat: MAIN_LAT,
      lng: MAIN_LNG,
    },
    {
      draggable: true,
      icon: mainPinIcon,
    },
  );

  mainMarker.addTo(map);
  mainMarker.on('moveend', (evt) => {
    addressField.value = getAddress(evt.target.getLatLng().lat, evt.target.getLatLng().lng, PRECISION);
  });

  return map;
};

/**
 * Создает маркер для объекта, создает и привязывает к нему попап с характеристиками предложения
 * @param {Object} markerGroup - ссылка на слой с объектами
 * @param {Object}  accomodation - объект с характеристиками предложения
 */
const createMarker = (markerGroup, accomodation) => {
  const marker = L.marker(
    {
      lat: accomodation.location.lat,
      lng: accomodation.location.lng,
    },
    {
      pinIcon,
    },
  );

  marker
    .addTo(markerGroup)
    .bindPopup(createAccomodationPopup(accomodation));
};

/**
 * Создает слой с группой маркеров на карте. Маркер создается для каждого объекта из массива accomodations
 * @param {param} map - ссылка на карту
 * @param {Array}  accomodations - массив объектов с характеристиками предложения жилья
 * @return {Object} markerGroup - ссылка на слой с группой маркеров
 */
const createMarkerGroup = (accomodations, map) => {
  const markerGroup = L.layerGroup().addTo(map);

  accomodations.forEach((accomodation) => {
    createMarker(markerGroup, accomodation);
  });

  return markerGroup;
};

const deleteMarkerGroup = (markerGroup) => {
  markerGroup.clearLayers();
};

export { toggleStatus, setSlider, setValidators, createMap, createMarkerGroup, deleteMarkerGroup };

