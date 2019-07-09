const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');
const webpack = require('webpack');
const copyWebpackPlugin = require('copy-webpack-plugin');

/**
 * Run dotenv
 * It converts .env file to process.ENV variables
 * That variables are then processed below with Webpack.DefinePlugin
 */
dotenv.config();

const config = {
  context: path.join(__dirname, '..', 'src'),
  entry: ['./index.js'],
  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '/',
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
  },
  module: {
    rules: [
      /**
       * babel-loader
       * @description https://github.com/babel/babel-loader
       * Use babel to compile ES<x> to ES5
       * Using .babelrc file for settings
       */
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },

      /**
       * url-loader
       * @description https://github.com/webpack-contrib/url-loader
       * Load images, also below 8kb image create base64 inline image
       */
      {
        test: /\.(png|jp(e*)g|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8000,
              name: 'images/[hash]-[name].[ext]',
            },
          },
        ],
      },

      /**
       * url-loader
       * @description https://github.com/webpack-contrib/url-loader
       * Load fonts in woof/woof2 format
       */
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff',
            },
          },
        ],
      },

      /**
       * file-loader
       * @description https://github.com/webpack-contrib/file-loader
       * Load fonts in ttf/eot/svg format in easiest way
       */
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },

      /**
       * sass-loader
       * @description https://github.com/webpack-contrib/sass-loader
       * Load styles in sass/scss files (also css available)
       */
      {
        test: /\.(sass|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    /**
     * htmlWebpackPlugin
     * @description https://github.com/jantimon/html-webpack-plugin
     * Insert js file automatically into html main file
     */
    new htmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
    }),

    /**
     * DefinePlugin
     * @description https://webpack.js.org/plugins/define-plugin/
     * Create own plugins or constants to be available in app
     */
    new webpack.DefinePlugin({
      API_BASE_URL: JSON.stringify(process.env.API_BASE_URL),
      GRID_IMAGE_HEIGHT: +process.env.GRID_IMAGE_HEIGHT,
      GRID_IMAGE_WIDTH: +process.env.GRID_IMAGE_WIDTH,
    }),

    /**
     * copyWebpackPlugin
     * @description @https://github.com/webpack-contrib/copy-webpack-plugin
     * Copy assets to build location
     */
    new copyWebpackPlugin([
      { from: 'app/assets', to: path.resolve(__dirname, 'public', 'assets') },
    ]),
  ],

  /**
   * optimization
   * @description https://github.com/webpack/docs/wiki/optimization
   * That section is configured by specific environment settings
   */
  optimization: {
    minimizer: [],
  },
};

module.exports = config;
