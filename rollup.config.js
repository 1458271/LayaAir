import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
//import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import glsl from 'rollup-plugin-glsl';
const path = require('path')
// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

const resolveFile = function(filePath) {
    return path.join(__dirname, '..', filePath)
}
  

export default {
    //input: './src/debug/PerformanceTest_Maggots.ts',
    input: './src/debug/LayaUISample.ts',
    //input: './src/debug/test/test.ts',
    treeshake: false,
	output: {
		file: 'bin/bundle.js',
		format: 'iife', // immediately-invoked function expression — suitable for <script> tags
        sourcemap: false,
        name:'laya',
        //indent: false
	},
	plugins: [
        typescript({
            //abortOnError:false
            check: false
        }),
        glsl({
			// By default, everything gets included
			include: './**/*.glsl',
			sourceMap: false
		}),        
		//resolve(), // tells Rollup how to find date-fns in node_modules
		//commonjs(), // converts date-fns to ES modules
		//production && terser() // minify, but only in production
	]
};