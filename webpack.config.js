const path = require('path');
const miniCss = require('mini-css-extract-plugin');
const OptimizeCss = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
 
module.exports = {
	mode: 'development',
	entry: './index.ts',
	devtool: false,
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	resolve: {
        // Добавить расширения '.ts' и '.tsx' в список разрешаемых
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
	module: {
		rules: [{
			test:/\.(s*)css$/,
			use: [
				miniCss.loader,
				'css-loader?url=false',
				'sass-loader',
			]
		},
		{ test: /\.tsx?$/, use: "ts-loader", exclude: /node_modules/ },
		{
			test: /\.m?js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
			  loader: 'babel-loader',
			  options: {
				presets: ['@babel/preset-env'],
				plugins: ['@babel/plugin-proposal-object-rest-spread']
			  }
			}
		  }]
	},
	optimization: {
		minimizer: [
			new OptimizeCss()
		],
	},
	plugins: [
		new miniCss({
			filename: 'style.css',
		})
	]
};