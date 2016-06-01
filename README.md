# npmとwebpackで作るいい感じのp5.js開発環境 2016年5月の場合。

[npmとwebpackで作るいい感じのフロントエンド開発環境（React.js使わない）2016年5月の場合。](https://github.com/shigekitakeguchi/npm-webpack-sass)  
これをベースにして今度はp5.jsの開発環境。

[p5.js](http://p5js.org/)  
Processingの記述っぽい感じをJavaScriptで実現したもの。  
Processing.jsもあるけどJavaのコードをそのまま動かせるのが特徴。でもいかんせんキモい。  
p5.jsの方がJavaScriptの機能やHTMLのオブジェクトとの連携がシンプル。

## 必要なものあるかどうか確認

```
node -v
```
まずはお決まりのNode.js入ってるか確認。

```
npm -v
```
npm（Node.jsのパッケージマネージャー）も入ってるか確認。

```
webpack -v
```
webpackも入っているか確認。  
もし入ってなかったら

```
npm install -g webpack
```
-gオプションはGlobalオプションのこと。

## ファイル・フォルダ構成

```
git clone https://github.com/shigekitakeguchi/npm-webpack-p5js-sass.git
```
[https://github.com/shigekitakeguchi/npm-webpack-p5js-sass](https://github.com/shigekitakeguchi/npm-webpack-p5js-sass)

GitHubから落として使ってください。  
カスタマイズなりなんなりして。

```
cd npm-webpack-p5js-sass
```
落としたフォルダ内に移動する。

```
├── LICENSE
├── README.md
├── app
│   ├── index.html
│   ├── scripts
│   │   └── bundle.js
│   └── styles
│       └── style.css
├── bs-config.json
├── package.json
├── src
│   ├── scripts
│   │   └── app.js
│   └── scss
│       ├── _normalize.css
│       └── style.scss
└── webpack.config.js
```

ファイル・フォルダ構成はこんな感じ。README.mdとLICENSEは不要。  
/src/scss/にnormalize.cssを含めた。resetがお好きならresetを。このあたりは好みで。  
/app/index.htmlを含めてるけど内容は適宜変更ください。

```
npm install
```
これで必要なパッケージがインストールされるはず。

## package.json

```json
{
  "name": "npm-webpack-p5.js-sass",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "dependencies": {
    "p5": "^0.5.0"
  },
  "devDependencies": {
    "concurrently": "^2.1.0",
    "lite-server": "^2.2.0",
    "node-sass": "^3.7.0",
    "nodemon": "^1.9.2",
    "webpack": "^1.13.0"
  },
  "scripts": {
    "webpack": "webpack -w",
    "lite": "lite-server",
    "build-css": "node-sass ./src/scss/style.scss ./app/styles/style.css --output-style compressed",
    "watch-css": "nodemon -e scss -x \"npm run build-css\"",
    "start": "concurrently \"npm run lite\" \"npm run webpack\" \"npm run watch-css\""
  },
  "keywords": [],
  "author": "shigeki.takeguchi",
  "license": "MIT"
}
```
中身はこんな感じ。

### パッケージの説明

落としてきたpackage.jsonからインストールすればいいんですがそれぞれのパッケージの説明を。

```
npm install --save p5
```
[https://github.com/processing/p5.js](https://github.com/processing/p5.js)

言わずもがななp5.js。requireしたいのでnpmしましょう。

```
npm install --save-dev concurrently
```
[https://github.com/kimmobrunfeldt/concurrently](https://github.com/kimmobrunfeldt/concurrently)

concurrentlyは複数のコマンド実行できるようにするため。具体的に何をしているかは後ほど説明。

```
npm install --save-dev lite-server
```
[https://github.com/johnpapa/lite-server](https://github.com/johnpapa/lite-server)

webpackにもwebpack dev serverというのがあるみたいだけどlite-serverのがシンプルで良さそうなので使ってみた。  
ただし設定ファイルは必要でした。

```
npm install --save-dev node-sass
```
[https://github.com/sass/node-sass](https://github.com/sass/node-sass)

node-sassでSassのコンパイル。全体的にNode.jsなのでSassのコンパイルだけRubyでなくてもいいだろうということで導入。

```
npm install --save-dev nodemon
```
[https://github.com/remy/nodemon](https://github.com/remy/nodemon)

scssを監視してコマンドを実行する。具体的に何をしているかは後ほど説明。

```
npm install --save-dev webpack
```
[https://github.com/webpack/webpack](https://github.com/webpack/webpack)

webpack。もうすでに何をするツールなのか説明しがたいくらい機能がある。  
静的なファイル（JavaScript系、CSS系、画像ファイル）の依存関係を解決するためのビルドツールってことなんだけど、ここでははJavaScriptだけを扱うようにしている。

## package.jsonの中のscriptsで何をしているか

```json
"scripts": {
  "webpack": "webpack -w",
  "lite": "lite-server",
  "build-css": "node-sass ./src/scss/app.scss ./app/styles/app.css --output-style compressed",
  "watch-css": "nodemon -e scss -x \"npm run build-css\"",
  "start": "concurrently \"npm run lite\" \"npm run webpack\" \"npm run watch-css\""
},
```

```
npm start
```
このコマンドでlite-serverを立ち上げwebpackでwatchを行いcssの変更を監視するようにしている。  

```json
"start": "concurrently \"npm run lite\" \"npm run webpack\" \"npm run watch-css\""
```
scriptsの中にあるstartがこれにあたる。

```
npm run lite
```
```
npm run webpack
```
```
npm run watch-css
```
これらのコマンドはそれぞれ独立したコマンドですが、最初にちょっと触れたがconcurrentlyにダブルクオーテーションでくくってスペースで区切って引数で渡せば並行して実行することになる。便利。

```json
"webpack": "webpack -w",
```
これはwebpackのwatch（監視）を走らせている。こちらも後ほど触れるがwebpack.config.jsonで記述されたことをもとに監視している。

```json
"lite": "lite-server",
```
lite-serverを立ち上げている。bs-config.jsonに設定ないようを記述している（こちらも後ほど触れる）。

```json
"build-css": "node-sass ./src/scss/app.scss ./app/styles/app.css --output-style compressed",
```
Sass（Scss）をnode-sassを使ってコンパイルしている。  

* ./src/scss/app.scssはコンパイルする前のファイル。css（個人的にはScss記法だけど）の記述はこれにする。
* ./app/styles/app.cssはコンパイル後のファイル。
* --output-style compressedはコンパイル後のファイルを圧縮する設定。他にはnested、expanded（これが一般的に人が書くのに近いスタイル）、compactが使える。これはガイドラインや好みで。

[Sass Documentation(output_style)](http://sass-lang.com/documentation/file.SASS_REFERENCE.html#output_style)

```json
"watch-css": "nodemon -e scss -x \"npm run build-css\"",
```
nodemonを使ってscssファイルを監視し、変更があれば「npm run build-css」を走らせるという設定。  
「-e scss」ってのがscssを監視するというオプション。-xは「npm run build-css」を実行するためのオプションになる。

## webpack.config.json
```javascript
var webpack = require("webpack");

module.exports = {
  entry: './src/scripts/app.js',
  output: {
    path: __dirname + '/app/scripts',
    filename: 'bundle.js',
		publicPath: '/app/',
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin()
  ]
}
```
webpackの設定はいたってシンプル。entryにもとファイル（複数ある場合は配列で持たせる）。outputに出力される設定を記述。今回はbundle.jsっていう一般的によく使われているらしい名称のまま。  
素のままのファイルだともうファイルがでかくてあれなんでUglifyJsPluginで圧縮・最適化。

## bs-config.json

```json
{
  "injectChanges": "true",
  "files": ["./app/**/*.{html,htm,css,js}"],
  "watchOptions": { "ignored": "node_modules" },
  "server": { "baseDir": "./app" }
}
```
lite-serverの設定はドキュメントルートをappの直下にしたかったのと監視対象のファイル（html、css、js）が変更されたらリロードしてinjectChangesというBrowsersyncを動すため。

## p5.jsを使っての記述

```javascript
var p5 = require('p5');

function sketch(p) {
  p.setup = function() {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.background(0);
  }

  p.draw = function() {
	  if (p.mouseIsPressed) {
	    p.fill(0);
	  } else {
	    p.fill(255);
	  }
    p.ellipse(p.mouseX, p.mouseY, 80, 80);
  }
}

var app = new p5(sketch, document.body);

```
[http://p5js.org/get-started/](http://p5js.org/get-started/)

このページのサンプルを記述するとしたらこんな感じになる。    
ただしrequireしたp5.jsは普通の記述では動かない。  

[https://p5js.org/examples/examples/Instance_Mode_Instantiation.php](https://p5js.org/examples/examples/Instance_Mode_Instantiation.php)

このページにあるようにinstance modeで記述する必要がある。

---

まだwebpackをはじめて数日とかという状態なので間違えや指摘をいただけると助かります。
