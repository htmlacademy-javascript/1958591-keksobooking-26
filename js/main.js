import { getData } from './api.js';
import { createSuccessMessage } from './util.js';
import { createMap, createMarkerGroup, deleteMarkerGroup } from './map.js';
import { toggleStatus, setSlider, setValidators, setFormSubmit } from './form.js';

const ACCOMODATION_COUNT = 10;

const SELECTORS = [
  'ad-form',
  'map__filters',
];

setSlider();
toggleStatus(SELECTORS[0], false);
toggleStatus(SELECTORS[1], false);
setValidators();

setFormSubmit(createSuccessMessage);

const map = createMap();

getData((accomodations) => {
  createMarkerGroup(accomodations.slice(0, ACCOMODATION_COUNT), map);
  toggleStatus(SELECTORS[1], true);
});

export { deleteMarkerGroup };
