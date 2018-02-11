'use strict';

var format = require('nanoid/format');

var defaults = require('../defaults');

var crypto = window.crypto || window.msCrypto;

var random = crypto ? cryptoRandom : insecureRandom;

function cryptoRandom(length) {
  // eslint-disable-next-line no-undef
  return crypto.getRandomValues(new Uint8Array(length));
}

function insecureRandom(length) {
  /*
  NEVER EVER USE THIS FOR REAL ID GENERATION
  Math.random() is not secure and this particular usage is naive
  This is done purely for example demo to work in IE10 and lower
  */

  return Array.apply(null, Array(length)).map(function() {
    return Math.floor(Math.random() * 256);
  });
}

function generateExample(input) {
  var requireExample;
  var lengthExample = input.size === defaults.size ? '' : input.size;
  var exampleId = format(random, input.alphabet, input.size);

  var shownAlphabet = input.alphabet.replace('\\', '\\\\').replace("'", "\\'");

  if (input.alphabet === defaults.alphabet) {
    requireExample =
      "<keyword>var</> nanoid <op>=</> \
<func>require</>(<str>'nanoid'</>);\
<br />\
<br />\
model.id = <func>nanoid</>(<num>" +
      lengthExample +
      '</>);';
  } else {
    requireExample =
      "<keyword>var</> generate <op>=</> \
<func>require</>(<str>'nanoid/generate'</>);\
<br />\
<keyword>var</> alphabet <op>=</> <str>'" +
      shownAlphabet +
      "'</>;<br />\
<br />\
model.id = <func>generate</>(alphabet, <num>" +
      input.size +
      '</>);';
  }

  requireExample += ' <comment>// => "' + exampleId + '"</>';

  requireExample = requireExample
    .replace(/<(op|func|comment|keyword|str|num)>/g, '<span class="hl-$1">')
    .replace(/<\/>/g, '</span>');

  return requireExample;
}

module.exports = generateExample;
