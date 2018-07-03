'use strict';

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

sizeInput.value = defaults.size;
alphabetInput.value = defaults.alphabet;
speedInput.value = 1000;

var throttledCalculate = throttle(calculate, 150);

['input', 'change'].forEach(function(evName) {
  [sizeInput, alphabetInput, speedInput, speedUnitInput].forEach(function(
    elem
  ) {
    elem.addEventListener(evName, throttledCalculate, false);
  });
});

calculate();

function calculate() {
  var input = {
    size: Number(sizeInput.value),
    alphabet: alphabetInput.value,
    uniqAlphabet: alphabetInput.value.split('').reduce(function(res, letter) {
      return res.indexOf(letter) === -1 ? res + letter : res;
    }, ''),
    speed:
      speedUnitInput.value === 'hour'
        ? Number(speedInput.value)
        : Number(speedInput.value) * 60 * 60,
    probability: 1
  };

  result(input);
  example(input);
  validate(input);
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
