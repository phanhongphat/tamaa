import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';

import { SheetsRegistry, JssProvider } from 'react-jss';

export default class JssDocument extends Document {
	static async getInitialProps(context) {
		const registry = new SheetsRegistry();
		const page = context.renderPage(App => props => (
			<JssProvider registry={registry}>
				<App {...props} />
			</JssProvider>
		));

		const props = await super.getInitialProps(context);
		const {
			req: { locale, localeDataScript }
		} = context;

		return {
			...page,
			registry,
			locale,
			localeDataScript
		};
	}

	onHover = () => {
		console.log('1');
	};

	render() {
		// Polyfill Intl API for older browsers
		const polyfill = `https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.${this.props.locale}`;
		return (
			<html>
				<Head>
					<title>Administrateur | Pass Tama'a</title>
					<style id="server-side-styles">{this.props.registry.toString()}</style>
					<link rel="stylesheet" type="text/css" href="/static/nprogress.css" />
					<meta content="width=device-width, initial-scale=1" name="viewport" />
					<link href="https://fonts.googleapis.com/css?family=Poppins&display=swap" rel="stylesheet" />
					<link rel="shortcut icon" type="image/x-icon" href="/static/assets/images/favicon/favicon.ico" />
				</Head>

				<body onMouseOver={() => this.onHover()}>
					<Main />
					<script src={polyfill} />
					<script
						dangerouslySetInnerHTML={{
							__html: this.props.localeDataScript
						}}
					/>
					<NextScript />
				</body>
			</html>
		);
	}
}
