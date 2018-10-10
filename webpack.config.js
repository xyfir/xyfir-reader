const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');
const CONFIG = require('./constants/config');
const path = require('path');

const PROD = CONFIG.ENVIRONMENT == 'production';

module.exports = {
  mode: CONFIG.ENVIRONMENT,

  entry: './components/App.jsx',

  output: {
    filename: 'App.js',
    path: path.resolve(__dirname, 'dist')
  },

  resolve: {
    modules: [__dirname, 'node_modules'],
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'actions'),
          path.resolve(__dirname, 'components'),
          path.resolve(__dirname, 'constants'),
          path.resolve(__dirname, 'lib'),
          path.resolve(__dirname, 'reducers')
        ],
        exclude: /node_modules/,
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  browsers: [
                    'last 2 Chrome versions',
                    'last 2 Firefox versions',
                    'last 2 iOS versions',
                    'last 2 Android versions'
                  ]
                }
              }
            ],
            '@babel/preset-react'
          ]
        }
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(CONFIG.ENVIRONMENT)
      }
    }),
    PROD ? new CompressionPlugin({ filename: '[path].gz' }) : null
  ].filter(p => p !== null)
};
