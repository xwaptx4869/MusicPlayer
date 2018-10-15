var gulp = require('gulp');

//引入压缩图片文件插件
var imagemin = require('gulp-imagemin');

//检查文件是否更新
var newer = require('gulp-newer');

//压缩html
var htmlClean = require('gulp-htmlclean')

//压缩js
var uglify = require('gulp-uglify');

//除去js中的开发调试语句
var jsdebug = require('gulp-strip-debug');

//合并js文件为一个js文件
var jsconcat = require('gulp-concat');

//less转换css插件
var less = require('gulp-less');

//postcss，插件系统，可以在它基础上使用多种插件，下面两个
var postcss = require('gulp-postcss')

//自动添加兼容css前缀
var prefix = require('autoprefixer')

//压缩css
var cssnano = require('cssnano')

//开启服务器
var connect = require('gulp-connect')


var deveMode = process.env.NODE_ENV=="development" ;
console.log(process.env.NODE_ENV);
console.log(deveMode);
var folder = {
    src :'./src/',
    dist : './dist/'
}
//流文件操作
gulp.task("images",function(){//创建任务
    gulp.src(folder.src+'images/*')//读文件
        .pipe(newer(folder.dist +"images"))
        .pipe(imagemin())
        .pipe(gulp.dest(folder.dist + "images"))//写入文件
})
//可以在task中传入第二个参数，数组[]，里面放入依赖名，ex：['images'],gulp html 时就会先执行gulp images操作
gulp.task("html",function(){
    var page = gulp.src(folder.src + 'html/*')
        // .pipe(newer(folder.dist +'html'))
        page.pipe(connect.reload())//热加载
        if(!deveMode){
            page.pipe(htmlClean())
        }
        page.pipe(gulp.dest(folder.dist +"html"))
})
gulp.task("js",function(){
    var page = gulp.src(folder.src + 'js/*')
        page.pipe(newer(folder.dist +'js'))
        .pipe(connect.reload())//热加载
       if(!deveMode){
        page.pipe(jsdebug())
        // .pipe(jsconcat('main.js'))
        .pipe(uglify())
       }
        page.pipe(gulp.dest(folder.dist +"js"))
})
gulp.task("css",function(){
    var page = gulp.src(folder.src + 'css/*')
        .pipe(newer(folder.dist +'css'))
        .pipe(connect.reload())//热加载
        .pipe(less())
        if(!deveMode){
            page.pipe(postcss([prefix(),cssnano()]))
        }
        page.pipe(gulp.dest(folder.dist +"css"))
})
gulp.task('watch',function (){
        gulp.watch(folder.src +'html/*',['html']);
        gulp.watch(folder.src +'css/*',['css']);
        gulp.watch(folder.src +'js/*',['js']);
        gulp.watch(folder.src +'images/*',['images']);


})
gulp.task('server',function(){
    connect.server({
        port:"8090",//改端口号
        livereload:true//热加载
    });
})
//默认 执行gulp 打包传入所有依赖
gulp.task('default',['images','html','js','css','watch','server'],function(){

})