'use strict';

var generate = require('nanoid/non-secure/generate');

var defaults = require('../defaults');

function generateExample(input) {
  var requireExample;
  var lengthExample = input.size === defaults.size ? '' : input.size;
  var exampleId = generate(input.alphabet, input.size);

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
