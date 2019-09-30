const path = require(`path`);
const MomentLocalesPlugin = require(`moment-locales-webpack-plugin`);
module.exports = {
  mode: `development`, // режим сборки
  entry: `./src/main.js`, // точка входа приложения
  output: {
    filename: `bundle.js`,
    path: path.join(__dirname, `public`)
  },
  devtool: `source-map`,
  devServer: {
    contentBase: path.join(__dirname, `public`),
    publicPath: `http://localhost:8080/`,
    compress: false,
    watchContentBase: true
  },
  plugins: [
    new MomentLocalesPlugin({
      localesToKeep: [`es-us`],
    })
  ]
};
