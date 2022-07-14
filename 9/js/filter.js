/**
 * Создает объект - образец для фильтрации
 */
const createFilterSample = () => {
  const featuresFilters = document.querySelectorAll('.map__checkbox');
  const checkedFeatures = [];
  let maxRank = 0;
  featuresFilters.forEach((featuresFilter) => {
    if (featuresFilter.checked === true) {
      checkedFeatures.push(featuresFilter.value);
      maxRank = maxRank + 1;
    }
  });
  const filterSample = {
    rank: '',
    type: '',
    price: '',
    rooms: '',
    guest: '',
    features: checkedFeatures
  };

  if (document.querySelector('#housing-type').value !== 'any') {
    filterSample.type = document.querySelector('#housing-type').value;
    maxRank = maxRank + 1;
  }

  if (document.querySelector('#housing-price').value !== 'any') {
    filterSample.price = document.querySelector('#housing-price').value;
    maxRank = maxRank + 1;
  }

  if (document.querySelector('#housing-rooms').value !== 'any') {
    filterSample.rooms = document.querySelector('#housing-rooms').value;
    maxRank = maxRank + 1;
  }

  if (document.querySelector('#housing-guests').value !== 'any') {
    filterSample.guest = document.querySelector('#housing-guests').value;
    maxRank = maxRank + 1;
  }

  filterSample.rank = maxRank;
  return filterSample;

};

const countRank = ({ offer }, filterSample) => {

  let rank = 0;

  if ((offer.type !== undefined) && (offer.type === filterSample.type)) {
    rank += 1;
  }
  if ((offer.price !== undefined) && (filterSample.price === 'low') && (offer.price < 10000)) {
    rank += 1;
  }
  if ((offer.price !== undefined) && (filterSample.price === 'high') && (offer.price > 50000)) {
    rank += 1;
  }
  if ((offer.price !== undefined) && (filterSample.price === 'middle') && (offer.price >= 10000) && (offer.price <= 50000)) {
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
      //if (offer.features.some((feature) => filter === feature)) {
      //   rank += 1;
      //  }
      offer.features.forEach((feature) => {
        if (filter === feature) {
          rank += 1;
        }
      });
    });
  }
  return rank;
};

export { countRank, createFilterSample };
