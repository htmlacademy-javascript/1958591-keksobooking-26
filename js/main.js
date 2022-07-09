import { getData } from './api.js';
import { toggleStatus, setSlider, setValidators, createMap, createMarkerGroup, deleteMarkerGroup } from './form.js';

const ACCOMODATION_COUNT = 10;

const SELECTORS = [
  'ad-form',
  'map__filters',
];

setSlider();
toggleStatus(SELECTORS[0], false);
toggleStatus(SELECTORS[1], false);
setValidators();

const map = createMap();

getData((accomodations) => {
  createMarkerGroup(accomodations.slice(0, ACCOMODATION_COUNT), map);
  toggleStatus(SELECTORS[1], true);
});

export { deleteMarkerGroup };
