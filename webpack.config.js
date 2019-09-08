const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');
const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html", 
  filename: "./index.html"
});
module.exports = {
  entry: ['babel-polyfill',"./src/index.js"],
  output: { 
    path: path.join(__dirname, 'dist'),
    filename:  '[name].[hash:8].js',
    sourceMapFilename: '[name].[hash:8].map',
  }, 
  plugins: [htmlPlugin],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: "file-loader",
        options: { name: '/static/[name].[ext]' }
      },
      {
        test: /\.sol/, 
        loader: 'truffle-solidity'
      },
      {
        test: /\.jade$/,
        loader: 'jade'
      },
      {
        test: /\.css$/,
        use: ['style-loader','css-loader'],
        include: [/src/, /node_modules/]
      }, 
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['@babel/env','@babel/react'] //'stage-2']
        }
      }
      
    ]
  },
   resolve: {
    alias: {
      'react-native$': 'react-native-web'
    }
  }
};