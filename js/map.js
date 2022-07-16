import { createAccomodationPopup } from './cards.js';
import { toggleFormStatus } from './form.js';
import { getAddress } from './util.js';
import { countFilterPoint, createFilterSample } from './filter.js';

const MAIN_LAT = 35.68941;
const MAIN_LNG = 139.69235;
const PRECISION = 5;
const SCALE = 12;

const MAX_ACCOMODATION_COUNT = 10;

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

/**
* Создает карту и возвращает ссылку нее.
* @return {Object} map - ссылка на карту
*/
const createMap = () => {
  const map = L.map('map-canvas')
    .on('load', () => {
      toggleFormStatus('ad-form', true);
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

  return map;
};

/**
* Создает главный маркер, отображает адрес в соответствующем поле. Возвращает ссылку на главный маркер
* @param {Object} map - ссылка на карту
* @return {Object} mainMarker - ссылка на маркер
*/
const createMainMarker = (map) => {
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

  return mainMarker;
};

/**
 * Создает маркер для объекта, создает и привязывает к нему попап с характеристиками предложения
 * @param {Object} markerGroup - ссылка на слой с объектами
 * @param {Object}  accomodation - объект с характеристиками предложения
 */
const createMarker = (accomodation, markerGroup) => {
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
 * Фильтрует предложения жилья, создает маркеры и отрисовывает их на карте
 * @param {Object} markerGroup - ссылка на слой с маркерами
 * @param {Array} accomodations - массив объектов с характеристиками предложения жилья
 */
const renderFilteredMarkerGroup = (accomodations, markerGroup) => {
  markerGroup.clearLayers();
  const filterSample = createFilterSample();
  let counterFitAccomodation = 0;
  for (let i = 0; i < accomodations.length; i++) {
    if (countFilterPoint(accomodations[i], filterSample) === filterSample.filterPoint) {
      if (counterFitAccomodation >= MAX_ACCOMODATION_COUNT) {
        break;
      }
      counterFitAccomodation += 1;
      createMarker(accomodations[i], markerGroup);
    }
  }
};

/**
 *Создает маркеры и отрисовывает их на карте.
 * @param {Object} map - ссылка на карту
 * @param {Array} accomodations - массив объектов с характеристиками предложения жилья
 * @return {Object} markerGroup - ссылка на слой маркеров
 */
const renderMarkerGroup = (accomodations, map) => {
  const markerGroup = L.layerGroup().addTo(map);
  accomodations
    .slice(0, MAX_ACCOMODATION_COUNT)
    .forEach((accomodation) => {
      createMarker(accomodation, markerGroup);
    });
  toggleFormStatus('map__filters', true);

  return markerGroup;
};

/**
 * Возвращает в центр главный маркер, сбрасывает фильтры и очищает слой с маркерами на карте.
 * Отрисовывает маркеры (без фильтрации).
 * @param {Object} markerGroup - ссылка на слой с маркерами
 * @param {Object} markerGroup - ссылка на главный маркер
 * @param {Array} accomodations - массив объектов с характеристиками предложения жилья
 */
const resetFilteredMarkerGroup = (accomodations, markerGroup, mainMarker) => {
  mainMarker.setLatLng(L.latLng(MAIN_LAT, MAIN_LNG));
  const mapFilter = document.querySelector('.map__filters');
  markerGroup.clearLayers();
  accomodations
    .slice(0, MAX_ACCOMODATION_COUNT)
    .forEach((accomodation) => {
      createMarker(accomodation, markerGroup);
    });
  mapFilter.reset();
};

export { renderMarkerGroup, renderFilteredMarkerGroup, resetFilteredMarkerGroup, createMap, createMainMarker };
