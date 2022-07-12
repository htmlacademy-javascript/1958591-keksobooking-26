import { createAccomodationPopup } from './cards.js';
import { toggleStatus } from './form.js';
import { getAddress } from './util.js';


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
let markerGroup;
//let map;


const createFilterSample = () => {
  const featuresFilters = document.querySelectorAll('.map__checkbox');
  const checkedFeatures = [];
  let maxRank = 0;
  featuresFilters.forEach((featuresFilter) => {
    if (featuresFilter.checked === true) {
      checkedFeatures.push(featuresFilter.value);
      maxRank = maxRank + 1;
    }
  });
  const filterSample = {
    rank: '',
    typeFilter: '',
    priceFilter: '',
    roomsFilter: '',
    guestFilter: '',
    featuresFilters: checkedFeatures
  };

  if (document.querySelector('#housing-type').value !== 'any') {
    filterSample.typeFilter = document.querySelector('#housing-type').value;
    maxRank = maxRank + 1;
  }

  if (document.querySelector('#housing-price').value !== 'any') {
    filterSample.priceFilter = document.querySelector('#housing-price').value;
    maxRank = maxRank + 1;
  }

  if (document.querySelector('#housing-rooms').value !== 'any') {
    filterSample.roomsFilter = document.querySelector('#housing-rooms').value;
    maxRank = maxRank + 1;
  }

  if (document.querySelector('#housing-guests').value !== 'any') {
    filterSample.guestFilter = document.querySelector('#housing-guests').value;
    maxRank = maxRank + 1;
  }

  filterSample.rank = maxRank;
  return filterSample;

};

const countRank = ({ offer }, filterSample) => {

  let rank = 0;

  if ((offer.type !== undefined) && (offer.type === filterSample.typeFilter)) {
    rank += 1;
  }
  if ((offer.price !== undefined) && (filterSample.priceFilter === 'low') && (offer.price < 10000)) {
    rank += 1;
  }
  if ((offer.price !== undefined) && (filterSample.priceFilter === 'high') && (offer.price > 50000)) {
    rank += 1;
  }
  if ((offer.price !== undefined) && (filterSample.priceFilter === 'middle') && (offer.price >= 10000) && (offer.price <= 50000)) {
    rank += 1;
  }
  if ((offer.rooms !== undefined) && (offer.rooms === +filterSample.roomsFilter) && (offer.rooms !== 0)) {
    rank += 1;
  }
  if ((offer.guests !== undefined) && (offer.guests === +filterSample.guestFilter) && (offer.guests !== 0)) {
    rank += 1;
  }
  // if (offer.features !== undefined) {
  //   for (let i = 0; i < filterSample.featuresFilters.length; i++) {
  //     for (let j = 0; j < offer.features.length; j++) {
  //       if (filterSample.featuresFilters[i] === filterSample.featuresFilters[j]) {
  //         rank += 1;
  //       }
  //     }
  //   }
  // }

  if (offer.features !== undefined) {
    filterSample.featuresFilters.forEach((filter) => {
      offer.features.forEach((feature) => {
        if (filter === feature) {
          rank += 1;
        }
      });
    });
  }
  return rank;
};

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
const createMarker = (accomodation) => {
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
const renderMarkerGroup = (accomodations, accomodationCount) => {
  //newaAccomodations = accomodations;
  const map = createMap();
  markerGroup = L.layerGroup().addTo(map);
  accomodations
    .slice(0, accomodationCount)
    .forEach((accomodation) => {
      createMarker(accomodation);
    });
  toggleStatus('map__filters', true);
  const mapFilters = document.querySelector('.map__filters');
  mapFilters.addEventListener('change', () => {
    markerGroup.clearLayers();
    const newSample = createFilterSample();
    //console.log(newSample);
    accomodations
      .slice()
      .filter((accomodation) => countRank(accomodation, newSample) === newSample.rank)
      .slice(0, accomodationCount)
      .forEach((accomodation) => {
        createMarker(accomodation);
        //console.log(accomodation);
        //console.log(countRank(accomodation, newSample));
      });
  });
};


// const filterMarkers = (accomodations, accomodationCount) => {
//   markerGroup.clearLayers();
//   markerGroup = L.layerGroup().addTo(map);
//   //Здесь вызываем rank для каждого элемента массива и сортируем массив, или обрезаем - с зависимости от максимального rank
//   const rankedAccomodations = accomodations.slice(0, accomodationCount);
//   choosenAccomodations.forEach((accomodation) => {
//     createMarker(accomodation);
//   });
// };

// function onMapFiltersChange() {
//   const newSample = createFilterSample();
//   const newacc1 = newaAccomodations
//     .slice()
//     .filter(((accomodation) => countRank(accomodation, newSample) === newSample.rank));

//   //console.log(newacc1);
// }

const SetMarkers = () => {
  const latlng = L.latLng(MAIN_LAT, MAIN_LNG);
  mainMarker.setLatLng(latlng);
  const addressField = document.querySelector('#address');
  addressField.value = getAddress(MAIN_LAT, MAIN_LNG, PRECISION);
  markerGroup.clearLayers();
};

export { renderMarkerGroup, SetMarkers };
