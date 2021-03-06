var gulp = require("gulp");
var ejs = require("gulp-ejs");
var rename = require("gulp-rename"); //ファイルリネーム
var fs = require('fs');
var ampify = require('gulp-ampify'); // AMPページ変換に使用

var amp_output = './amp-html'; // AMPページの出力先
var amp_path = './amp-html/*.html' //AMPページの元となるHTMLの格納場所

gulp.task('ejs', function(){
  var tempFile = "./contents/normal-html-tmp/*.ejs", // ejsファイルの格納先（普通のHTML）
      ampFile = "./contents/amp-html-tmp/*.ejs", // ejsファイルの格納先（AMP HTML）
      json = JSON.parse(fs.readFileSync("./contents/json/page.json")), // JSONファイル読み込み
      jsonAmp = JSON.parse(fs.readFileSync("./contents/json/ampdata.json")), // JSONファイル読み込み
      pages = json.pages,
      ampSchema = jsonAmp.schema,
      id;

  for(var i = 0; i < pages.length; i++){　//jsonの要素数だけページ生成
    id = pages[i].id;

    gulp.src(tempFile) //通常ページの作業
      .pipe(ejs({
        jsonData: pages[i]
      }))
      .pipe(rename(pages[i].name + '.html'))
      .pipe(gulp.dest('./html/'));

    gulp.src(ampFile) //AMPページの作業
    .pipe(ejs({
      jsonData: pages[i], ampData: ampSchema[i]
    }))
    .pipe(rename(pages[i].name + '_amp.html'))
    .pipe(ampify(amp_output))　//ここでAMPファイルに置換
    .pipe(gulp.dest(amp_output));
  }
});
gulp.task('default', ['ejs']);

gulp.task('watch', ['ejs'], function(){
  gulp.watch('./contents/**/*.ejs', ['ejs']);
});
