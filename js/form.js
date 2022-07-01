const SELECTORS = [
  'ad-form',
  'map__filters',
];

const MIN_TITLE_LENGTH = 30;
const MAX_TITLE_LENGTH = 100;
const MAX_ROOMS = 100;
const MAX_PRICE = 100000;

const Capacity = {
  '1': ['1'],
  '2': ['1', '2'],
  '3': ['1', '2', '3'],
  '100': ['0']
};

const MinPrice = {
  'bungalow': 0,
  'flat': 1000,
  'hotel': 3000,
  'house': 5000,
  'palace': 10000
};

/**
 * Переключает класс с модификатором --disabled у форм из массива FORMS,
 * переключает атрибут disable у их потомков.
 * @param {Boolean}  status - true для перевода в активный статус, false для перевода в неактивный
 */
const toggleStatus = (status) => {

  SELECTORS.forEach((selector) => {
    const toggleForm = document.querySelector(`.${selector}`);
    if (status) {
      toggleForm.classList.remove(`${selector}--disabled`);
    } else {
      toggleForm.classList.add(`${selector}--disabled`);
    }

    const elements = Array.from(toggleForm.children);
    elements.forEach((element) => {
      element.disabled = !status;
    });
  });
};


const form = document.querySelector(`.${SELECTORS[0]}`);

const pristine = new Pristine(form, {
  classTo: 'ad-form__element',
  errorClass: 'ad-form__item--invalid',
  successClass: 'ad-form__item--valid',
  errorTextParent: 'ad-form__element',
  errorTextTag: 'span',
  errorTextClass: 'ad-form__error'
});

//Валидация заголовка
const titleField = form.querySelector('#title');
/**
 * Проверяет значение поле title - обязательное, от 30 до 100 символов
 * @param {String}  value - значение поля
 * @returns {boolean} - возвращает true, если поле заполнено правильно
 */
const validateTitle = (value) => value.length >= MIN_TITLE_LENGTH && value.length <= MAX_TITLE_LENGTH;

/**
 * Возвращает текст сообщения об ошибке, если поле title заполнено неверно
 */
const getTitleErrorMessage = () => `Заголовок объявления должен содержать от ${MIN_TITLE_LENGTH} до ${MAX_TITLE_LENGTH} символов`;

pristine.addValidator(titleField, validateTitle, getTitleErrorMessage);

//Валидация комнаты - гости
const roomField = form.querySelector('#room_number');
const guestField = form.querySelector('#capacity');

/**
 * Проверяет синхронизацию комнат и мест (поля поля room_number и capacity), правило описано в объекте Capacity
 * @returns {boolean} - возвращает true, если поля заполнены правильно
 */
const validateGuest = () => Capacity[roomField.value].includes(guestField.value);
/**
 * Возвращает текст сообщения об ошибке, если поля room_number и capacity заполнены неверно
 */
const getGuestErrorMessage = () => `${(roomField.value < MAX_ROOMS) && (guestField.value !== '0') ? 'Число гостей не может быть больше числа комнат.' : '100 комнат не для гостей!'}`;
pristine.addValidator(guestField, validateGuest, getGuestErrorMessage);

//Валидация тип - цена
const priceField = form.querySelector('#price');
const typeField = form.querySelector('#type');
/**
 * Проверяет значение поля price - обязательное, в диапазоне от минимума до MAX_PRICE, где минимум
 * определяется полем type (тип жилья), правило записано в объекте MinPrice
 * @returns {boolean} - возвращает true, если поле заполнено правильно
 */
const validatePrice = () => priceField.value >= MinPrice[typeField.value] && priceField.value <= MAX_PRICE;
/**
 * Возвращает текст сообщения об ошибке, если поле price заполнено неверно
 */
const getPriceErrorMessage = () => `${priceField.value <= MAX_PRICE ? `Цена за ночь должна быть не меньше ${MinPrice[typeField.value]} руб.` : `Цена за ночь должна быть меньше ${MAX_PRICE} руб.`}`;
pristine.addValidator(priceField, validatePrice, getPriceErrorMessage);

/**
 * Меняет значение плейсхолдера поля price при изменении значения в поле type
 */
const onTypeChange = () => {
  priceField.placeholder = MinPrice[typeField.value];
  //pristine.validate(priceField);
};

typeField.addEventListener('change', onTypeChange);

//Валидация въезд - выезд

const timeFields = form.querySelectorAll('.ad-form__element--time select');

/**
 * Проверяет синхронизацию полей timein и timeout (значения должны быть равны)
 * @returns {boolean} - возвращает true, если поля заполнены правильно
 */
const validateTime = () => timeFields[0].value === timeFields[1].value;

/**
 * Возвращает текст сообщения об ошибке, если поля timein и timeout заполнены неверно
 */
const getTimeErrorMessage = () => 'Выберите одинаковое время заезда и выезда';

timeFields.forEach((field) => pristine.addValidator(field, validateTime, getTimeErrorMessage));

form.addEventListener('submit', (evt) => {
  evt.preventDefault();
  pristine.validate();
});

export { toggleStatus };
