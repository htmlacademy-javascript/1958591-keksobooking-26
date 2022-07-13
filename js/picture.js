const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

const choosePhoto = (fileChooser, preview) => {
  fileChooser.addEventListener('change', () => {
    const file = fileChooser.files[0];
    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some((it) => fileName.endsWith(it));
    //Если нету фотоэлемента, его нужно сделать?
    if (matches) {
      preview.src = URL.createObjectURL(file);
    }
  });
};


const previewAvatar = document.querySelector('.ad-form-header__preview img');
const fileChooserAvatar = document.querySelector('#avatar');
choosePhoto(fileChooserAvatar, previewAvatar);

const fileChooserOffer = document.querySelector('#images');


const photoList = document.querySelector('.ad-form__photo');
const photoItem = document.createElement('img');
photoList.append(photoItem);
const previewOffer = document.querySelector('.ad-form__photo img');

choosePhoto(fileChooserOffer, previewOffer);


export { choosePhoto };

