import { getData } from './api.js';
import { createSuccessMessage } from './util.js';
import { renderFilteredMarkerGroup, renderMarkerGroup, resetFilteredMarkerGroup, createMap, createMainMarker } from './map.js';
import { toggleFormStatus, setSlider, setValidators, fulfilFormSubmit, setHandlerOnMapFilter, fulfilFormReset } from './form.js';
import { debounce } from './util.js';
import { setHandlerToPhotoElement } from './picture.js';

setSlider();
toggleFormStatus('ad-form', false);
toggleFormStatus('map__filters', false);
setValidators();

getData((accomodations) => {
  const map = createMap();
  const mainMarker = createMainMarker(map);
  const markerGroup = renderMarkerGroup(accomodations, map);
  setHandlerOnMapFilter(debounce(
    () => renderFilteredMarkerGroup(accomodations, markerGroup),
  ));
  fulfilFormReset(
    () => resetFilteredMarkerGroup(accomodations, markerGroup, mainMarker)
  );
});

setHandlerToPhotoElement('#avatar', 'ad-form-header__preview');
setHandlerToPhotoElement('#images', 'ad-form__photo');

fulfilFormSubmit(createSuccessMessage);

