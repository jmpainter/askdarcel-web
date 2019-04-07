const { readFileSync } = require('fs');
const yaml = require('js-yaml');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtendedDefinePlugin = require('extended-define-webpack-plugin');

const CONFIG_YAML = process.env.CONFIG_YAML || 'config.yml';

// Take the user config from the file, and override keys with environment variables if they exist
const userConfig = yaml.safeLoad(readFileSync(CONFIG_YAML, 'utf8'));
const environmentConfig = [
  'GOOGLE_API_KEY',
  'ALGOLIA_INDEX_PREFIX',
  'ALGOLIA_APPLICATION_ID',
  'ALGOLIA_READ_ONLY_API_KEY',
  'MOHCD_SUBDOMAIN',
  'MOHCD_DOMAIN',
  'TESTCAFE_RUNNING',
];

const config = environmentConfig.reduce((acc, key) => {
  if (process.env[key] !== undefined) { acc[key] = process.env[key]; }
  return acc;
}, userConfig);

const appRoot = path.resolve(__dirname, 'app/');
const buildDir = path.resolve(__dirname, 'build');

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  context: __dirname,
  entry: ['whatwg-fetch', 'babel-polyfill', path.resolve(appRoot, 'init.jsx')],
  output: {
    path: buildDir,
    publicPath: '/dist/',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: {
      assets: path.resolve(appRoot, 'assets'),
      actions: path.resolve(appRoot, 'actions'),
      components: path.resolve(appRoot, 'components'),
      reducers: path.resolve(appRoot, 'reducers'),
      styles: path.resolve(appRoot, 'styles'),
      utils: path.resolve(appRoot, 'utils'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Ask Darcel',
      template: 'app/index.html',
    }),
    new ExtendedDefinePlugin({
      CONFIG: config,
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['es2015', 'react', 'stage-0'],
            },
          },
        ],
        exclude: [/node_modules/, /typings/],
      },
      {
        // Legacy stylesheets are not wrapped with CSS Modules, allowing the
        // selector class names to be usable globally.
        exclude: [
          path.resolve(__dirname, 'app/components/ui/HamburgerMenu'),
          path.resolve(__dirname, 'app/components/ui/Navigation'),
        ],
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: false,
            },
          },
          'sass-loader',
        ],
      },
      {
        // New stylesheets are treated as locally-scoped CSS modules.
        include: [
          path.resolve(__dirname, 'app/components/ui/HamburgerMenu'),
          path.resolve(__dirname, 'app/components/ui/Navigation'),
        ],
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg|ico)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]-[sha512:hash:hex:8].[ext]',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
              disable: true,
            },
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: buildDir,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: process.env.API_URL || 'http://localhost:3000',
        pathRewrite: { '^/api': '' },
      },
    },
  },
};
