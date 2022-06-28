import { createAccomodations } from './mocks/data.js';
import { createAccomodationCards } from './cards.js';
import { toggleStatus } from './form.js';

const ACCOMODATION_COUNT = 10;
const accomodations = createAccomodations(ACCOMODATION_COUNT);

createAccomodationCards(accomodations);
toggleStatus(['ad-form', 'map__filters'], true);
