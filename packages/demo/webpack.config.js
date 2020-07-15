const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: 'development',
	watch: true,
	entry: ['./src/index.tsx'],
	devtool: 'inline-source-map',
	optimization: {
		removeAvailableModules: false,
		removeEmptyChunks: false,
		splitChunks: false,
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: ['babel-loader'],
			},
			{
				test: /\.tsx?$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							reportFiles: [
								"../**/src/**/*.{ts,tsx}"
							],
							projectReferences: true,
							// allowTsInNodeModules: true,
							// transpileOnly: true,
							// experimentalWatchApi: true,
						}
					}
				],
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	output: {
		path: `${__dirname}/public`,
		publicPath: '/',
		filename: 'app.js',
	},
	plugins: [
		new webpack.DefinePlugin({
			__DEV__: true,
		}),
	],
	devServer: {
		contentBase: path.resolve(__dirname, 'public'),
		// liveReload: true,
		port: 9000,
		hot: true,
		historyApiFallback: true,
		// writeToDisk: true,
	},
};