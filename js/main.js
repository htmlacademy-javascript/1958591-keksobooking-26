function getRandomInteger(minValue, maxValue) {
  if (minValue < 0) {
    minValue = 0;
  }
  if (maxValue < minValue) {
    maxValue = minValue;
  }
  return Math.floor(Math.random() * (maxValue - minValue)) + minValue;
}

function getRandomFloat(minValue, maxValue, precision) {
  if (minValue < 0) {
    minValue = 0;
  }
  if (maxValue < minValue) {
    maxValue = minValue;
  }
  return (Math.random() * (maxValue - minValue) + minValue).toFixed(precision);
}

function getMinPrice(accommodationType) {
  switch (accommodationType) {
    case 'Бунгало':
      return 0;
    case 'Квартира':
      return 1000;
    case 'Отель':
      return 3000;
    case 'Дом':
      return 5000;
    case 'Дворец':
      return 10000;
    default:
      return 0;
  }
}

getRandomInteger(6, 12);
getRandomFloat(3.12, 4.56, 2);
getMinPrice('Квартира');

