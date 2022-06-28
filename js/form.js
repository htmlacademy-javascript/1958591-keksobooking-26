/**
 * Переключает класс с модификатором --disabled у переданных элементов,
 * переключает атрибут disable у их потомков.
 * @param {Array} selectors - массив строк с селекторами нужных элементов
 * @param {Boolean}  status - true для перевода в активный статус, false для перевода в неактивный
 */
const toggleStatus = (selectors, status) => {
  selectors.forEach((selector) => {
    const form = document.querySelector(`.${selector}`);
    if (status) {
      form.classList.remove(`${selector}--disabled`);
    } else {
      form.classList.add(`${selector}--disabled`);
    }

    const elements = Array.from(form.children);
    elements.forEach((element) => {
      element.disable = !status;
    });
  });
};

export { toggleStatus };
