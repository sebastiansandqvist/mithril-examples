import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

module.exports = {
	entry: 'src/index.js',
	dest: 'public/bundle.js',
	format: 'iife',
	plugins: [
		nodeResolve({ browser: true }),
		commonjs(),
		buble()
	]
}