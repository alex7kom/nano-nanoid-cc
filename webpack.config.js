const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const StyleExtHtmlWebpackPlugin = require('style-ext-html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { importLoaders: 1 }
            },
            'postcss-loader'
          ]
        })
      }
    ]
  },
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  plugins: [
    new UglifyJsPlugin(),
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new ScriptExtHtmlWebpackPlugin({
      inline: ['bundle.js']
    }),
    new StyleExtHtmlWebpackPlugin()
  ]
};
