import { getData } from './api.js';
import { createSuccessMessage } from './util.js';
import { renderMarkerGroup } from './map.js';
import { toggleStatus, setSlider, setValidators, setFormSubmit } from './form.js';

const ACCOMODATION_COUNT = 10;

setSlider();
toggleStatus('ad-form', false);
toggleStatus('map__filters', false);
setValidators();

getData((accomodations) => {
  renderMarkerGroup(accomodations, ACCOMODATION_COUNT);
});

setFormSubmit(createSuccessMessage);

