'use strict';

var timeNames = [
  { n: ['second', 'seconds'], m: 1 },
  { n: ['minute', 'minutes'], m: 60 },
  { n: ['hour', 'hours'], m: 60 },
  { n: ['day', 'days'], m: 24 },
  { n: ['month', 'months'], m: 30.5 },
  { n: ['year', 'years'], m: 12 },
  { n: ['century', 'centuries'], m: 100 },
  { n: ['thousand years', 'thousands of years'], m: 10 },
  { n: ['million years', 'millions of years'], m: 1000 },
  { n: ['billion years', 'billions of years'], m: 1000 },
  { n: ['trillion years', 'trillions of years'], m: 1000 }
];

function formatDuration(seconds) {
  var current = seconds;
  for (var index = 0; index < timeNames.length; index++) {
    var timeName = timeNames[index];

    current /= timeName.m;

    if (!timeNames[index + 1] || current / timeNames[index + 1].m < 1) {
      return Math.round(current) + ' ' + timeName.n[current === 1 ? 0 : 1];
    }
  }
}

module.exports = formatDuration;
