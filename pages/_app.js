import App, { Container } from 'next/app';
import React from 'react';
import NProgress from 'nprogress';
import { Provider } from 'react-redux';
import withRedux from 'next-redux-wrapper';
import withReduxSaga from 'next-redux-saga';
import { IntlProvider, addLocaleData } from 'react-intl';
import cookie from 'react-cookies';

import createStore from 'src/redux/store';
import { Router } from 'src/routes';
import '../style.less';

import { LocaleProvider } from 'antd';

import frFR from 'antd/lib/locale-provider/fr_FR';

import moment from 'moment';
import 'moment/locale/fr';
import fr from 'react-intl/locale-data/fr';

import messagesFr from 'src/lang/fr.json';
import messagesEn from 'src/lang/en.json';

const messages = {
	fr: messagesFr,
	en: messagesEn
};

addLocaleData(fr);
moment.locale('fr');

Router.events.on('routeChangeStart', url => {
	console.log(`Loading: ${url}`);
	NProgress.start();
});

Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

// Register React Intl's locale data for the user's locale in the browser. This
// locale data was added to the page by `pages/_document.js`. This only happens
// once, on initial page load in the browser.
if (typeof window !== 'undefined' && window.ReactIntlLocaleData) {
	Object.keys(window.ReactIntlLocaleData).forEach(lang => {
		addLocaleData(window.ReactIntlLocaleData[lang]);
	});
}

// @withRedux(createStore)
// @withReduxSaga({ async: true })
// export default class MyApp extends App {
class MyApp extends App {
	static async getInitialProps({ Component, ctx }) {
		let pageProps = {};
		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx);
		}
		return { pageProps };
	}

	render() {
		const { Component, pageProps, store, initialNow } = this.props;
		const frAnt = cookie.load('_lang') === 'EN' ? undefined : frFR;
		const locale = cookie.load('_lang') === 'EN' ? 'ed' : 'fr';
		return (
			<LocaleProvider locale={frAnt}>
				<IntlProvider locale={locale} messages={messages[locale]} initialNow={initialNow}>
					<Container>
						<Provider store={store}>
							<Component {...pageProps} />
						</Provider>
					</Container>
				</IntlProvider>
			</LocaleProvider>
		);
	}
}

export default withRedux(createStore)(withReduxSaga(MyApp));
