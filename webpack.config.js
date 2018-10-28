const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => ({
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json', '.jsx']
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
          'stylus-loader',
        ],
      },
      { 
          test: /\.js[x]$/, 
          exclude: /node_modules/, 
          loader: "babel-loader"
      }
    ]
  }
});