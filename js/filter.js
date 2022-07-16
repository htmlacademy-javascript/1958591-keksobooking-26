const OFFER_PRICE_LOW = 10000;
const OFFER_PRICE_HIGH = 50000;

/**
 * Создает объект - образец для фильтрации
 * @returns {object} filterSample - искомый объект
 */
const createFilterSample = () => {
  const typeFilter = document.querySelector('#housing-type');
  const priceFilter = document.querySelector('#housing-price');
  const roomFilter = document.querySelector('#housing-rooms');
  const guestFilter = document.querySelector('#housing-guests');
  const featuresFilters = document.querySelectorAll('.map__checkbox');

  const checkedFeatures = [];
  let maxPoint = 0;
  featuresFilters.forEach((featuresFilter) => {
    if (featuresFilter.checked === true) {
      checkedFeatures.push(featuresFilter.value);
      maxPoint = maxPoint + 1;
    }
  });
  const filterSample = {
    filterPoint: '',
    type: '',
    price: '',
    rooms: '',
    guest: '',
    features: checkedFeatures
  };
  if (typeFilter.value !== 'any') {
    filterSample.type = typeFilter.value;
    maxPoint = maxPoint + 1;
  }
  if (priceFilter.value !== 'any') {
    filterSample.price = priceFilter.value;
    maxPoint = maxPoint + 1;
  }
  if (roomFilter.value !== 'any') {
    filterSample.rooms = roomFilter.value;
    maxPoint = maxPoint + 1;
  }
  if (guestFilter.value !== 'any') {
    filterSample.guest = guestFilter.value;
    maxPoint = maxPoint + 1;
  }
  filterSample.filterPoint = maxPoint;

  return filterSample;
};

/**
 * Вычисляет совпадение переданного объекта с образцом для фильтрации
 * @returns {object} filterSample - искомый объект
 */
const countFilterPoint = ({ offer }, filterSample) => {
  let rank = 0;
  if ((offer.type !== undefined) && (offer.type === filterSample.type)) {
    rank += 1;
  }
  if ((offer.price !== undefined) && (filterSample.price === 'low') && (offer.price < OFFER_PRICE_LOW)) {
    rank += 1;
  }
  if ((offer.price !== undefined) && (filterSample.price === 'high') && (offer.price > OFFER_PRICE_HIGH)) {
    rank += 1;
  }
  if ((offer.price !== undefined) && (filterSample.price === 'middle') && (offer.price >= OFFER_PRICE_LOW) && (offer.price <= OFFER_PRICE_HIGH)) {
    rank += 1;
  }
  if ((offer.rooms !== undefined) && (offer.rooms === +filterSample.rooms) && (offer.rooms !== 0)) {
    rank += 1;
  }
  if ((offer.guests !== undefined) && (offer.guests === +filterSample.guest) && (offer.guests !== 0)) {
    rank += 1;
  }
  if (offer.features !== undefined) {
    filterSample.features.forEach((filter) => {
      offer.features.forEach((feature) => {
        if (filter === feature) {
          rank += 1;
        }
      });
    });
  }
  return rank;
};

export { countFilterPoint, createFilterSample };
