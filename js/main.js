import { getData } from './api.js';
import { createSuccessMessage } from './util.js';
import { renderMarkerGroup, filterMarkerGroup } from './map.js';
import { toggleStatus, setSlider, setValidators, setFormSubmit, setFilters } from './form.js';
import { debounce } from './util.js';
import './picture.js';

const RERENDER_DELAY = 500;

const ACCOMODATION_COUNT = 10;

setSlider();
toggleStatus('ad-form', false);
toggleStatus('map__filters', false);
setValidators();

getData((accomodations) => {
  const markerGroup = renderMarkerGroup(accomodations, ACCOMODATION_COUNT);
  setFilters(debounce(
    () => filterMarkerGroup(accomodations, ACCOMODATION_COUNT, markerGroup),
    RERENDER_DELAY,
  ));
});

setFormSubmit(createSuccessMessage);

