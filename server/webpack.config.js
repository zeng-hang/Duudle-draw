const path = require("node:path");
const nodeExternals = require("webpack-node-externals");

const hasDev = process.env.NODE_ENV === "development";

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  target: "node",
  mode: process.env.NODE_ENV || "development",
  entry: {
    app: "./app.js"
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: '[name].js',
    clean: true
  },
  stats: hasDev ? "errors-only" : "normal",
  devtool: hasDev ? "inline-source-map" : "source-map",
  externals: hasDev ? [] : [nodeExternals({
    allowlist: ['lowdb']
  })],
}
