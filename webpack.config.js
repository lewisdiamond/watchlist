'use strict';

const Path = require('path')
const webpack = require('webpack')
const BabiliPlugin = require("babili-webpack-plugin");

module.exports = {
	entry: ['babel-polyfill', './webtask.js'],
	bail: true, 
	output: {
		path: Path.resolve('./'),
		filename: 'bundle.js',
		library: 'webtask',
		libraryTarget: 'commonjs2',
	},
	module: {
		rules: [
			{
				resource: {
					test: /\.jsx?$/,
					exclude: /node_modules/,
				},
				use: [
					{
						options: {
							presets: [[require.resolve('babel-preset-env'), {
								targets: {
									node: 4,
								},
							}], "es2017", "es2015"],
							plugins: [require('babel-plugin-transform-object-rest-spread'), require('babel-plugin-transform-es2015-destructuring')]
						},
						loader: require.resolve('babel-loader'),
					},
				],
			},
			{
				issuer: {
					exclude: /node_modules/,
				},
				resource: {
					not: [/\.jsx?$/],
				},
				use: {
					loader: require.resolve('raw-loader'),
				},
			},
		],
	},
    externals: {
        lodash: {commonjs2: 'lodash'},
        axios: {commonjs2: 'axios'},
        yargs: {commonjs2: 'yargs'},
        'babel-polyfill': 'babel-polyfill',
    },
    plugins: [
        //new BabiliPlugin()
    ],
	resolve: {
		modules: [Path.join(process.cwd(), 'node_modules')],
		mainFields: ['module', 'main'],
	},
	resolveLoader: {
		modules: [Path.join(__dirname, 'node_modules')],
		// moduleExtensions: ['', '.webpack-loader.js', '.web-loader.js', '.loader.js', '.js'],
		mainFields: ['webpackLoader', 'loader', 'module', 'main'],
	},
	node: {
		console: false,
		global: false,
		process: false,
		Buffer: false,
		__filename: false,
		__dirname: false,
		setImmediate: false,
	},
	performance: {
		hints: false,
	},
	target: 'node',
} 
