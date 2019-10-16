const path = require("path")  //把相对路径转绝对路径，output需要绝对路径
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve("./dist"),
    filename: "script/bundle.js",   //打包后的js的名字/路径
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html"
    }),
    new CleanWebpackPlugin(),
  ],
  module: {
    rules: [
      {test:/.ts$/, use: {
        loader: 'ts-loader',
        options: {
          transpileOnly: true //webpack-run-server 和 HtmlWebpackPlugin插件联用出现问题的解决方法
        }
      }}
    ]
  },
  resolve: {
    extensions: ['.ts','.js'] //解析模块的时候都看看
  }
}