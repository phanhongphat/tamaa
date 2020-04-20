require('dotenv').config();
const Dotenv = require('dotenv-webpack');

const lessToJS = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');

const withPlugins = require('next-compose-plugins');
const withLess = require('@zeit/next-less');
const withCSS = require('@zeit/next-css');

const themeVariables = lessToJS(fs.readFileSync(path.resolve(__dirname, './src/assets/antd-custom.less'), 'utf8'));

const nextConfig = {
	// distDir: 'build',

	webpack: (config, { dev }) => {
		config.plugins = config.plugins || []; // eslint-disable-line
		// modify the `config` here
		config.plugins = [
			...config.plugins,

			// Read the .env file
			new Dotenv({
				path: path.join(__dirname, '.env'),
				systemvars: true
			})
		];
		return config;
	}
};

// fix: prevents error when .less files are required by node
if (typeof require !== 'undefined') {
	require.extensions['.less'] = file => {};
}

module.exports = withPlugins(
	[
		[
			withLess,
			{
				lessLoaderOptions: {
					javascriptEnabled: true,
					modifyVars: themeVariables
				}
			}
		],
		[
			withCSS,
			{
				cssModules: true
			}
		]
	],
	nextConfig
);
