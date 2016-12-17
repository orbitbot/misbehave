import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs    from 'rollup-plugin-commonjs';
import buble       from 'rollup-plugin-buble';
import filesize    from 'rollup-plugin-filesize';

let common = {
  entry      : 'index.js',
  format     : 'umd',
  moduleId   : 'Misbehave',
  moduleName : 'Misbehave',
  plugins    : [
    nodeResolve({ jsnext: true, main: true, browser: true }),
    commonjs(),
    buble(),
    filesize()
  ]
}

module.exports = [
  Object.assign(common, { dest: 'misbehave.js' }),
  Object.assign(common, { dest: 'docs/lib/misbehave.js' }),
]
