'use strict';

function getRandomBits(alphabetLength, size) {
  return size * (Math.log(alphabetLength) / Math.LN2);
}

function getGenerateForCollision(randomBits, probability) {
  return Math.sqrt(
    2 * Math.pow(2, randomBits) * Math.log(1 / (1 - probability))
  );
}

function getTimeToCollision(generateForCollision, speedPerSecond) {
  return Math.floor(generateForCollision / speedPerSecond);
}

module.exports = {
  getRandomBits: getRandomBits,
  getGenerateForCollision: getGenerateForCollision,
  getTimeToCollision: getTimeToCollision
};
