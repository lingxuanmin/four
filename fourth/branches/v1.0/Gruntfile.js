module.exports = function(grunt) {
    var cheerio = require('cheerio');
    var fs = require('fs');
    var cfg = JSON.parse(fs.readFileSync('./package.json'));
    var name = cfg.name;
    var version = cfg.version;
    var dest = {
        demo: '../../../../codePub/' + name + '/branches/' + version + '/demo',
        project: '../../../../codePub/' + name + '/branches/' + version + '/project'
    };

    /**
     * 找到公共组件的css和js文件,并放入cssArr 和 jsArr数组
     * @type {Array}
     */

    var cssArr = [];
    var jsArr = [];
 /*    (function getHtmls() {
        var files = fs.readdirSync('./');
        var filesArr = [];
        htmlReg = /^[^_].*\.html(?:\?.*|$)/
        files.forEach(function(v, k) {
            if (htmlReg.test(v)) {
                filesArr.push(v);
            };
        })
        return filesArr;
    })()
        .forEach(function(v, k) {
            var $ = cheerio.load(fs.readFileSync(v).toString());
            var dom = $.html();
            var cssReg = /.*components.*\.css$/;
            var jsReg = /.*components.*\.js$/;
            $('link')
                .filter(function() {
                    if (this.attr('href') != undefined) {
                        return !this.attr('href').match(/^http|https/) && (this.attr('rel') == 'stylesheet') && this.attr('href') ? /.css$/.test(this.attr('href')) : false;
                    };
                })
                .each(function(v, k) {
                    if (cssReg.test(this.attr('href'))) {
                        cssArr.push(this.attr('href'))
                    };
                })
            $('script')
                .filter(function() {
                    if (this.attr('src') != undefined) {
                        return !this.attr('src').match(/^http|https/) && (this.attr('type') == 'text/javascript' || !this.attr('type')) && this.attr('src') ? /.js$/.test(this.attr('src')) : false;
                    };
                })
                .each(function(v, k) {
                    if (jsReg.test(this.attr('src'))) {
                        jsArr.push(this.attr('src'))
                    };
                })

        })*/
    /**
     * 脚本开始
     * @type {[type]}
     */
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        /**
         * css语法检测,默认不执行，自行添加任务
         */
        csslint: {
            all: ['./src/css/*.css']
        },
        /**
         * js语法检测,默认不执行，自行添加任务
         */
        jshint: {
            all: ['./src/js/*/*.js']
        },
        /**
         * 构建在开发文件中的目录
         */
        cssmin: {
            /**
             * 合并并压缩
             */
            minify: {
                src: ['src/css/reset.css', 'src/css/framework.css', 'src/css/*.css', '!src/css/book.css', 'src/css/book.css'],
                dest: 'build/css/fourth.css'
            }
        },
        /**
         * js文件合并
         */
        concat: {
            dist: {
                files: {
                    'build/js/base.js': ['src/js/base/*.js'],
                    'build/js/fourth.js': ['src/js/fourth/main.js', 'src/js/fourth/*.js'],
                    'build/js/main.js': ['src/js/main.js']
                }
            }
        },
        /**
         * 图片清理
         */
        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['**/*.{png,gif}'],
                    dest: 'build/'
                }]
            }
        },
        /**
         * 页面资源链接合并
         */
        htmlbuild: {
            dist: {
                src: ['src/index.html', 'src/storeInfo.html', 'src/book.html'],
                dest: 'build/',
                options: {
                    beautify: false,
                    relative: true,
                    scripts: {
                        base: 'build/js/base.js',
                        fourth: 'build/js/fourth.js',
                        main: 'build/js/main.js'
                    },
                    styles: {
                        bundle: 'build/css/*.css'
                    }
                }
            },
            partial: {
                src: 'src/_*.html',
                dest: 'build/'
            }
        },
        /**
         * copy任务：按照构建图的规则把本地css下图片，js，images文件夹里的内容复制到即将对接到构建目录的project文件夹里，temp和*.html文件复制到即将对接到构建目录里的demo目录下。
         */
        copy: {
            buildImages: {
                expand: true,
                cwd: 'src/',
                src: ['**/*.{jpg,png,gif}'],
                dest: 'build/'
            },
            cssimages: {
                expand: true,
                cwd: './build/css/images',
                src: ['*'],
                dest: dest.project + '/css/images'
            },
            js: {
                expand: true,
                src: jsArr.concat(['./build/js/*.js']),
                dest: dest.project + '/js',
                flatten: true,
                filter: 'isFile'
            },
            images: {
                expand: true,
                cwd: './build/images/',
                src: '**',
                dest: dest.project + '/images/'
            },
            htmls: {
                expand: true,
                src: ['./build/*.html', './build/temp/**', '!./build/_*.html'],
                dest: dest.demo,
                options: {
                    process: function(content, filepath) {
                        var $ = cheerio.load(content);

                        /**
                         * css合并构建方式。移除所有css链接，并加上最终合并之后的链接
                         */

                        $('link')
                            .filter(function() {
                                if (this.attr('href') != undefined) {
                                    return !this.attr('href').match(/^http|https/) && (this.attr('rel') == 'stylesheet') && this.attr('href') ? /.css$|.css\?_component$/.test(this.attr('href')) : false;
                                };
                            })
                            .replaceWith('<link rel="stylesheet" href="../project/css/' + name + '.min.css">')

                        /**
                         * js非合并，但资源定位
                         */
                        $('script')
                            .filter(function() {
                                if (this.attr('src') != undefined) {
                                    return !this.attr('src').match(/^http|https/) && (this.attr('type') == 'text/javascript' || !this.attr('type')) && this.attr('src') ? /.js|.js\?_component$/.test(this.attr('src')) : false;
                                };
                            })
                            .attr('src', function(k, v) {
                                var reg = /.*components(?=\/).*(\/js\/.*)/
                                if (reg.test(v)) {
                                    return '../project/' + v.replace(reg, '$1');
                                } else {
                                    return '../project/' + this.attr('src')
                                }
                            })
                        /**
                         * 定位前景非零时图片
                         */
                        $('img[src^="images"]')
                            .filter(function() {
                                if (this.attr('src') != undefined) {
                                    return !this.attr('src').match(/^http|https/)
                                };
                            })
                            .attr('src', function() {
                                return '../project/' +  this.attr('src')
                            })

                        /**
                         * html 模块加载，匹配以_开头的html文件。并合到所引用的dom中。
                         */
                        var reg = /<\!--#include\s*virtual="(_.*)"-->/g;
                        var matched = $.html().match(reg);
                        var dom = $.html();
                        if (Object.prototype.toString.call(matched) != '[object Null]') {
                            matched.forEach(function(val) {
                                var filename = val.replace(reg, '$1');
                                dom = dom.replace(val, fs.readFileSync(filename));
                            })
                            return dom;
                        }
                    }
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-html-build');

    grunt.registerTask('lint', ['csslint', 'jshint']);
    grunt.registerTask('default', ['cssmin', 'concat', 'copy:buildImages', 'htmlbuild']);
}
