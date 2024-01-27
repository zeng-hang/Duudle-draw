import path from "path";

const __dirname = path.resolve();

export default {
  target: "node",
  mode: 'production',
  entry: {
    app: "./app.js"
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: '[name].js',
    clean: true
  },
  devtool: "source-map",
}
