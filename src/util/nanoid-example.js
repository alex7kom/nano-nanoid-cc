var format = require('nanoid/format');

var defaults = require('../defaults');

var crypto = window.crypto || window.msCrypto;

var random = crypto ? cryptoRandom : insecureRandom;

function cryptoRandom (length) {
  return crypto.getRandomValues(new Uint8Array(length));
}

function insecureRandom (length) {
  /*
  NEVER EVER USE THIS FOR REAL ID GENERATION
  Math.random() is not secure and this particular usage is naive
  This is done purely for example demo to work in IE10 and lower
  */

  return Array.apply(null, Array(length)).map(function () {
    return Math.floor(Math.random() * 256);
  });
}

function generateExample (input) {
  var requireExample;
  var lengthExample = input.size === defaults.size
    ? ''
    : input.size;
  var exampleId = format(random, input.alphabet, input.size);

  if (input.alphabet === defaults.alphabet) {
    requireExample = "var nanoid = require('nanoid');<br />\
<br />\
model.id = nanoid(" + lengthExample + "); // => \"" + exampleId + "\"";
  } else {
    requireExample = "var generate = require('nanoid/generate');<br />\
var alphabet = '" + input.alphabet + "';<br />\
<br />\
model.id = generate(alphabet, " + input.size + "); // => \"" + exampleId + "\"";
  }

  requireExample = requireExample
    .replace(/ = /g, ' <span class="hl-op">=</span> ')
    .replace(/\b(\S+?)\(/g, '<span class="hl-func">$1</span>(')
    .replace(/(\/\/.+?)$/gm, '<span class="hl-comment">$1</span>')
    .replace(/\b(var)\b/g, '<span class="hl-keyword">$1</span>')
    .replace(/('.+?')/g, '<span class="hl-str">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="hl-num">$1</span>');

  return requireExample;
}

module.exports = generateExample;
