import { createAccomodationPopup } from './cards.js';
import { toggleStatus } from './form.js';
import { getAddress, showAlert } from './util.js';


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
let mainMarker;

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
  mainMarker = L.marker(
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

// const deleteMarkerGroup = (markerGroup) => {
//   markerGroup.clearLayers();
// };

const deleteMarkerGroup = () => {
  showAlert('Привет');
};

export { createMap, createMarkerGroup, deleteMarkerGroup, mainMarker };
