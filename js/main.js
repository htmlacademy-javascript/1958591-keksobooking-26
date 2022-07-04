import { createAccomodations } from './mocks/data.js';
import { createAccomodationCard } from './cards.js';
import { toggleStatus } from './form.js';

const ACCOMODATION_COUNT = 10;
const accomodations = createAccomodations(ACCOMODATION_COUNT);

createAccomodationCard(accomodations[0]);
toggleStatus(true);
// const form = document.querySelector('ad-form');
// const titleField = form.querySelector('#title');
//form.setAttribute('novalidate', 'novalidate');
//titleField.setCustomValidity(' ffff fffff');


