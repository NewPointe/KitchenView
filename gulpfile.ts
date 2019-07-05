/*!
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
'use strict';

// tslint:disable:no-implicit-dependencies
import gulp from 'gulp';
import glob from 'glob';
import del from 'del';
import gulp_typescript from 'gulp-typescript';
import sourcemaps from 'gulp-sourcemaps';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import terser from 'gulp-terser';
import rename from 'gulp-rename';
import filter from 'gulp-filter';
import gulp_sass from 'gulp-sass';
import node_sass from 'node-sass';
// tslint:disable:no-var-requires
const tsify = require('tsify');
const buffer = require('gulp-buffer');
// tslint:enable

(gulp_sass as any).compiler = node_sass;

export async function clean() {
    return del("./dist");
}

export async function typescript_client() {

    const srcDir = "./src/client";
    const distDir = "./dist/client/scripts";
    const bundleName = "bundle";

    return browserify({
        basedir: '.',
        debug: true,
        entries: glob.sync(srcDir + "/*.ts"),
        cache: {},
        packageCache: {},
    })
    .on('error', (e: Error) => console.error(e))
    .plugin(tsify as {} as any, {
        project: srcDir + "/tsconfig.json"
    })
    .bundle()
    .pipe(source(bundleName + ".js"))
    .pipe((buffer as {} as any)() as NodeJS.ReadWriteStream)
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(distDir))
    .pipe(filter('**/*.js'))
    .pipe(terser())
    .pipe(rename(bundleName + ".min.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(distDir));
}

const tsProject_server = gulp_typescript.createProject('./src/server/tsconfig.json');
export async function typescript_server() {
    return tsProject_server.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject_server())
        .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: '../../src/' }))
        .pipe(gulp.dest("./dist"));
}

export function sass() {
    return gulp.src('./styles/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(gulp_sass().on('error', gulp_sass.logError)) // tslint:disable-line:no-unbound-method
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/client/styles'));
}

export function watch_sass() {
    gulp.watch('./styles/**/*.scss', sass);
}

export function watch_typescript_client() {
    gulp.watch(['./src/client/**/*.ts', './src/common/**/*.ts'], typescript_client);
}

export function watch_typescript_server() {
    gulp.watch(['./src/server/**/*.ts', './src/common/**/*.ts'], typescript_server);
}

export function watch_typescript() {
    watch_typescript_client();
    watch_typescript_server();
}

export function watch() {
    watch_sass();
    watch_typescript();
}

export const typescript = gulp.parallel(typescript_client, typescript_server);

export const build = gulp.parallel(typescript, sass);

export default gulp.series(clean, build);
