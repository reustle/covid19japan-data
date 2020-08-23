const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: {
    patients: ["./src/statusboard/patients.js", "./src/statusboard/patients.scss"],
    statusboard: ["./src/statusboard/statusboard.js", "./src/statusboard/statusboard.scss"],
    explore: ["./src/explore/explore.js", "./src/explore/explore.scss"],
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
      filename: "statusboard/patients.html",
      template: "src/statusboard/patients.html",
      chunks: ["patients"],
    }),
    new HtmlWebpackPlugin({
      filename: "statusboard/index.html",
      template: "src/statusboard/statusboard.html",
      chunks: ["statusboard"],
    }),
    new HtmlWebpackPlugin({
      filename: "explore/index.html",
      template: "src/explore/explore.html",
      chunks: ["explore"],
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
