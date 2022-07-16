import { showAlert } from './util.js';

const GET_ADDRESS = 'https://26.javascript.pages.academy/keksobooking/data';
const SEND_ADDRESS = 'https://26.javascript.pages.academy/keksobooking';

/**
 * Получает данные с сервера
 * @param {} onSuccess - cb, выполняется при успехе
 */
const getData = (onSuccess) => {
  fetch(GET_ADDRESS)
    .then((response) => response.json())
    .then((accomodations) => {
      onSuccess(accomodations);
    })
    .catch(() => {
      showAlert('Не удалось получить данные с сервера. Попробуйте ещё раз');
    });
};

/**
 * Отправляет данные на сервер
 * @param {} onSuccess - cb, выполняется при успехе
 * @param {} onFail - cb, выполняется при неудаче
 * @param {} body - данные формы, сгенерированные методом FormData
 */
const sendData = (onSuccess, onFail, body) => {
  fetch(
    SEND_ADDRESS,
    {
      method: 'POST',
      body: body,
    },
  )
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onFail('Не удалось отправить форму. Попробуйте ещё раз');
      }
    })
    .catch(() => {
      onFail('Не удалось отправить форму. Попробуйте ещё раз');
    });
};

export { getData, sendData };
