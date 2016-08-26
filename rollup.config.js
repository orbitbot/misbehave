import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs    from 'rollup-plugin-commonjs';
import buble       from 'rollup-plugin-buble';
import filesize    from 'rollup-plugin-filesize';

module.exports = {
  entry      : 'index.js',
  dest       : 'misbehave.js',
  format     : 'umd',
  moduleId   : 'Misbehave',
  moduleName : 'Misbehave',
  plugins    : [
    nodeResolve({ jsnext: true, main: true, browser: true }),
    commonjs(),
    buble(),
    filesize()
  ]
};
