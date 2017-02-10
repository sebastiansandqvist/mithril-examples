import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

module.exports = {
	entry: 'src/index.js',
	dest: 'public/bundle.04.js',
	format: 'iife',
	plugins: [
		nodeResolve({ browser: true }),
		commonjs(),
		buble(),
		uglify()
	]
};