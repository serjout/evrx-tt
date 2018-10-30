const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

console.log(path.join(__dirname, 'src/front/guide.styl'));

module.exports = (env, argv = { mode: 'development' }) => ({
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx'],
    alias: {
      './guide.styl$': path.join(__dirname, 'src/front/guide.styl'),
      'src': path.join(__dirname,('src')),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './index.html', hash: true }),
    new MiniCssExtractPlugin({ })
  ],
  module: {
    rules: [
      {
        test: /\.(styl|css)$/,
        use: [
          argv.mode === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              camelCase: true,
              localIdentName: '[name]-[local]-[hash:base64:5]',
              importLoaders: 1,
              minimize: argv.mode !== 'development',
            },
          },
          {
            loader: 'stylus-loader',
            options: {
              preferPathResolver: 'webpack'
            }
          },
        ],
      },
      { 
          test: /\.jsx?$/, 
          exclude: /node_modules/, 
          loader: "babel-loader"
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'docs'),
    compress: false,
    port: 9000
  }
});