import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs    from 'rollup-plugin-commonjs';
import buble       from 'rollup-plugin-buble';
import filesize    from 'rollup-plugin-filesize';

module.exports = {
  entry   : 'misbehave.js',
  dest    : 'build.js',
  format  : 'iife',
  plugins : [
    nodeResolve({ jsnext: true, main: true, browser: true }),
    commonjs(),
    buble(),
    filesize()
  ]
};
