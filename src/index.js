'use strict';

var initEasyLocation = require('easy-location');

require('./App.css');

var defaults = require('./defaults');
var generateExample = require('./util/nanoid-example');
var formatDuration = require('./util/duration');
var calc = require('./util/calc');
var throttle = require('./util/throttle');

var sizeInput = document.getElementById('Form-size');
var alphabetInput = document.getElementById('Form-alphabet');
var speedInput = document.getElementById('Form-speed');
var speedUnitInput = document.getElementById('Form-speed-unit');

var sizeError = document.getElementById('Form-error-size');
var alphabetError = document.getElementById('Form-error-alphabet');
var speedError = document.getElementById('Form-error-speed');

var resultWrapper = document.getElementById('Result-wrapper');
var resultElement = document.getElementById('Result');
var exampleElement = document.getElementById('Example-code');

var defaultParams = {
  size: defaults.size,
  alphabet: defaults.alphabet,
  speed: 1000,
  speedUnit: 'hour'
};

var easyLocation = initEasyLocation({
  onChange: function(data) {
    setValues(data.search);
    calculate();
  }
});

var throttledCalculate = throttle(calculate, 150);

['input', 'change'].forEach(function(evName) {
  [sizeInput, alphabetInput, speedInput, speedUnitInput].forEach(function(
    elem
  ) {
    elem.addEventListener(evName, throttledCalculate, false);
  });
});

function calculate() {
  var values = getValues();

  if (easyLocation) {
    easyLocation.reflect({
      search: values
    });
  }

  var input = {
    size: values.size,
    alphabet: values.alphabet,
    uniqAlphabet: values.alphabet.split('').reduce(function(res, letter) {
      return res.indexOf(letter) === -1 ? res + letter : res;
    }, ''),
    speed:
      values.speedUnit === 'hour'
        ? Number(values.speed)
        : Number(values.speed) * 60 * 60,
    probability: 1
  };

  result(input);
  example(input);
  validate(input);
}

function setValues(values) {
  sizeInput.value = values.size || defaultParams.size;
  alphabetInput.value = values.alphabet || defaultParams.alphabet;
  speedInput.value = values.speed || defaultParams.speed;
  speedUnitInput.value = values.speedUnit || defaultParams.speedUnit;
}

function getValues() {
  return {
    size: Number(sizeInput.value),
    alphabet: alphabetInput.value,
    speed: speedInput.value,
    speedUnit: speedUnitInput.value
  };
}

function result(input) {
  resultWrapper.style.display = 'none';

  if (input.uniqAlphabet.length < 2) {
    return;
  }

  if (input.probability <= 0 || input.probability > 100) {
    return;
  }

  if (input.size < 2 || input.speed < 1) {
    return;
  }

  resultWrapper.style.display = 'block';

  var randomBits = calc.getRandomBits(input.uniqAlphabet.length, input.size);

  var probability = input.probability / 100;
  var generateForCollision = calc.getGenerateForCollision(
    randomBits,
    probability
  );

  var speedPerSecond = input.speed / (60 * 60);
  var timeToCollision = calc.getTimeToCollision(
    generateForCollision,
    speedPerSecond
  );

  resultElement.innerHTML = formatDuration(timeToCollision);
}

function example(input) {
  exampleElement.style.display = 'none';

  if (input.uniqAlphabet.length < 2 || input.size <= 1) {
    return;
  }

  exampleElement.style.display = 'block';

  exampleElement.innerHTML = generateExample(input);
}

function validate(input) {
  sizeError.innerHTML = '';
  alphabetError.innerHTML = '';
  speedError.innerHTML = '';

  if (input.uniqAlphabet.length < 2) {
    alphabetError.innerHTML =
      'The alphabet should contain at least 2 <strong>unique</strong> symbols';
  }

  if (input.alphabet.length > 256) {
    alphabetError.innerHTML =
      'An alphabet with than 256 symbols is not secure due to algorithm limitations';
  }

  if (input.alphabet.length !== input.uniqAlphabet.length) {
    alphabetError.innerHTML =
      'The alphabet should not contain duplicate symbols';
  }

  if (input.size < 2) {
    sizeError.innerHTML = 'The length of the ID should be 2 or more';
  }

  if (input.speed < 1) {
    speedError.innerHTML = 'The speed should be 1 or more';
  }
}
