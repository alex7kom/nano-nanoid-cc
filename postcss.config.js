'use strict';

/* eslint-env node */

module.exports = {
  plugins: [
    require('postcss-normalize'),
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default'
    })
  ]
};
