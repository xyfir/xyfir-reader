const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CONFIG = require('./constants/config');
const path = require('path');

const PROD = CONFIG.ENVIRONMENT == 'production';

module.exports = {
  mode: CONFIG.ENVIRONMENT,

  entry: './lib/index.js',

  output: {
    publicPath: '/dist/',
    filename: PROD ? '[name].[hash].js' : '[name].js',
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
                    'last 1 iOS version',
                    'last 2 Chrome versions',
                    'last 1 Android version',
                    'last 1 Firefox version'
                  ]
                }
              }
            ],
            '@babel/preset-react'
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-syntax-dynamic-import'
          ]
        }
      },
      {
        test: /\.s?css$/,
        use: [
          PROD ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: { outputStyle: PROD ? 'compressed' : 'expanded' }
          }
        ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: { publicPath: '/dist' }
          }
        ]
      }
    ]
  },

  plugins: [
    PROD
      ? new MiniCssExtractPlugin({
          filename: '[name].[hash].css',
          chunkFilename: '[id].[hash].css'
        })
      : null,
    new HtmlWebpackPlugin({
      minify: PROD,
      template: 'template.html'
    }),
    PROD ? new CompressionPlugin({ filename: '[path].gz' }) : null,
    PROD ? null : new webpack.HotModuleReplacementPlugin()
  ].filter(p => p !== null),

  devtool: 'inline-source-map',

  watchOptions: {
    aggregateTimeout: 500,
    ignored: ['node_modules', 'dist']
  },

  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'dist'),
    port: 2080,
    hot: true
  }
};
