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
 * Возвращает функцию, генерирующую уникальный идентификатор.
 * @returns {function} - ссылка на экземпляр функции, в замыкании которой определена переменная lastGeneratedId.
 */
const createIdGenerator = () => {
  let lastGeneratedId = 0;
  return function () {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
};

/**
 * Возвращает уникальный идентификатор. Представляет собой ссылку на экземпляр функции,
 * созданной в результате выполнения функции createIdGenerator().
 * В замыкании этой функции переменная lastGeneratedId хранит значение предыдущего идентификатора после каждого вызова accomodationNumber().
 * @returns {Number} - возвращает уникальный идентификатор
 */
const generateAccomodationNumber = createIdGenerator();

export { getRandomInteger };
export { getRandomFloat };
export { getRandomArrayElement };
export { getRandomElements };
export { generateAccomodationNumber };
