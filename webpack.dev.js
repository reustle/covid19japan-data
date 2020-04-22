const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: {
    datasources: ["./src/datasources/index.js", "./src/datasources/index.scss"],
  },
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "[name].js",
    publicPath: "/",
  },

  devServer: {
    contentBase: "./docs",
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: "datasources/index.html",
      template: "src/datasources/index.html",
      chunks: ["datasources"],
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|gif|ico|geojson)$/,
        use: ["file-loader"],
      },
      {
        test: /\.csv$/,
        loader: 'csv-loader',
        options: {
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true
        }
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: "css-loader" },
          {
            loader: "sass-loader",
            options: { implementation: require("node-sass") },
          },
        ],
      },
    ],
  },
};
