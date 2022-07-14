import { createAccomodationPopup } from './cards.js';
import { toggleStatus } from './form.js';
import { getAddress } from './util.js';
import { countRank, createFilterSample } from './filter.js';

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
* Создает карту и возвращает ссылку нее.
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


const filterMarkerGroup = (accomodations, accomodationCount, markerGroup) => {
  markerGroup.clearLayers();
  const newSample = createFilterSample();
  accomodations
    .slice()
    .filter((accomodation) => countRank(accomodation, newSample) === newSample.rank)
    .slice(0, accomodationCount)
    .forEach((accomodation) => {
      createMarker(accomodation, markerGroup);
    });
};

/**
 * Отрисовывает группу маркеров на карте.
 * @param {param} map - ссылка на карту
 * @param {Array} accomodations - массив объектов с характеристиками предложения жилья
 */
const renderMarkerGroup = (accomodations, accomodationCount) => {
  const map = createMap();
  const mainMarker = createMainMarker(map);
  const markerGroup = L.layerGroup().addTo(map);

  const mapFilters = document.querySelector('.map__filters');
  const form = document.querySelector('.ad-form');
  const addressField = document.querySelector('#address');

  accomodations
    .slice(0, accomodationCount)
    .forEach((accomodation) => {
      createMarker(accomodation, markerGroup);
    });

  toggleStatus('map__filters', true);

  /**
   * Возвращает в центр главный маркер и очищает слой с маркерами на карте при сбросе значений формы ввода.
   */
  form.addEventListener('reset', () => {
    mainMarker.setLatLng(L.latLng(MAIN_LAT, MAIN_LNG));
    addressField.value = getAddress(MAIN_LAT, MAIN_LNG, PRECISION);
  });

  /**
   * Отрисовывает группу маркеров при сбросе значений формы с фильтрами.
   */
  mapFilters.addEventListener('reset', () => {
    markerGroup.clearLayers();
    addressField.value = getAddress(MAIN_LAT, MAIN_LNG, PRECISION);
    accomodations
      .slice(0, accomodationCount)
      .forEach((accomodation) => {
        createMarker(accomodation, markerGroup);
      });
  });

  return markerGroup;
};

export { renderMarkerGroup, filterMarkerGroup, createMarker };
