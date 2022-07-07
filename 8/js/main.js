import { createAccomodations } from './mocks/data.js';
import { toggleStatus, setSlider, setValidators, createMap, createMainMarker, createMarkerGroup, deleteMarkerGroup } from './form.js';

const ACCOMODATION_COUNT = 10;
const MAIN_LAT = 35.68941;
const MAIN_LNG = 139.69235;
const PRECISION = 5;
const SCALE = 12;

const accomodations = createAccomodations(ACCOMODATION_COUNT);

setSlider();
toggleStatus(false);
setValidators();
const map = createMap(MAIN_LAT, MAIN_LNG, SCALE);
const mainMarker = createMainMarker(map, MAIN_LAT, MAIN_LNG, PRECISION);
const markerGroup = createMarkerGroup(accomodations, map);

//deleteMarkerGroup(markerGroup);

export { markerGroup, mainMarker, deleteMarkerGroup };
