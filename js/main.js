import { createAccomodations } from './mocks/data.js';
import { createAccomodationCard } from './cards.js';
import { toggleStatus } from './form.js';

const ACCOMODATION_COUNT = 10;
const accomodations = createAccomodations(ACCOMODATION_COUNT);

createAccomodationCard(accomodations[0]);
toggleStatus(true);

