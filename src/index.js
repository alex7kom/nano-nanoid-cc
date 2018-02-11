'use strict';

require('./normalize.css');
require('./App.css');

var defaults = require('./defaults');
var generateExample = require('./util/nanoid-example');
var formatDuration = require('./util/duration');

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

['input', 'change'].forEach(function(evName) {
  [sizeInput, alphabetInput, speedInput, speedUnitInput].forEach(function(
    elem
  ) {
    elem.addEventListener(evName, calculate, false);
  });
});

calculate();

function calculate() {
  var input = {
    size: Number(sizeInput.value),
    alphabet: alphabetInput.value,
    uniqAlphabet: alphabetInput.value.split('').reduce(function(res, letter) {
      return res.indexOf(letter) !== -1 ? res : res + letter;
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

  var randomBits = Math.log(input.uniqAlphabet.length) / Math.LN2;

  var probability = input.probability / 100;
  var generateForCollision = Math.sqrt(
    2 * Math.pow(2, randomBits * input.size) * Math.log(1 / (1 - probability))
  );

  var speedPerSecond = input.speed / (60 * 60);
  var duration = Math.floor(generateForCollision / speedPerSecond);

  var timeToCollision = formatDuration(duration);

  resultElement.innerHTML = '~' + timeToCollision;
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
