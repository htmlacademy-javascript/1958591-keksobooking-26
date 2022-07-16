const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

/**
* Выбирает файл фотографии, показывает ее в элементе img. Если элемента нет, создает его.
*/
const setHandlerToPhotoElement = (fileChooserSelector, previewSelector) => {
  const fileChooser = document.querySelector(fileChooserSelector);
  fileChooser.addEventListener('change', () => {
    const file = fileChooser.files[0];
    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some((it) => fileName.endsWith(it));
    if (matches) {
      const researchPreview = document.querySelector(`.${previewSelector} img`);
      if (researchPreview === null) {
        const photoList = document.querySelector(`.${previewSelector}`);
        const photoItem = document.createElement('img');
        photoItem.alt = 'Фотография объекта';
        photoItem.width = '70';
        photoItem.height = '70';
        photoList.append(photoItem);
      }
      const preview = document.querySelector(`.${previewSelector} img`);
      preview.src = URL.createObjectURL(file);
    }
  });
};

export { setHandlerToPhotoElement };

