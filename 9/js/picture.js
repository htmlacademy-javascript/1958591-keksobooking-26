const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

const renderPhoto = (fileChooserSelector, previewSelector) => {
  let preview = document.querySelector(`.${previewSelector} img`);
  const fileChooser = document.querySelector(fileChooserSelector);
  fileChooser.addEventListener('change', () => {
    const file = fileChooser.files[0];
    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some((it) => fileName.endsWith(it));
    if (matches) {
      if (preview === null) {
        const photoList = document.querySelector(`.${previewSelector}`);
        const photoItem = document.createElement('img');
        photoItem.alt = 'Фотография объекта';
        photoItem.width = '70';
        photoItem.height = '70';
        photoList.append(photoItem);
        preview = document.querySelector(`.${previewSelector} img`);
      }
      preview.src = URL.createObjectURL(file);
    }
  });
};

export { renderPhoto };

