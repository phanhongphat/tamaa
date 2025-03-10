// Polyfill Node with `Intl` that has data for all locales.
// See: https://formatjs.io/guides/runtime-environments/#server
const IntlPolyfill = require('intl');
Intl.NumberFormat = IntlPolyfill.NumberFormat;
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
require('dotenv').config();

const path = require('path');
const fs = require('fs');
// const { readFileSync } = require('fs');
// const { basename } = require('path');
// const accepts = require('accepts');
// const glob = require('glob');

const { createServer } = require('http');
const next = require('next');
const routes = require('./src/routes');

const port = parseInt(process.env.PORT, 10) || 3001;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handler = routes.getRequestHandler(app);

// // Get the supported languages by looking for translations in the `lang/` dir.
// const supportedLanguages = glob.sync('./lang/*.json').map(f => basename(f, '.json'));

// // We need to expose React Intl's locale data on the request for the user's
// // locale. This function will also cache the scripts by lang in memory.
// const localeDataCache = new Map();
// const getLocaleDataScript = locale => {
// 	const lang = locale.split('-')[0];
// 	if (!localeDataCache.has(lang)) {
// 		const localeDataFile = require.resolve(`react-intl/locale-data/${lang}`);
// 		const localeDataScript = readFileSync(localeDataFile, 'utf8');
// 		localeDataCache.set(lang, localeDataScript);
// 	}
// 	return localeDataCache.get(lang);
// };

// // We need to load and expose the translations on the request for the user's
// // locale. These will only be used in production, in dev the `defaultMessage` in
// // each message description in the source code will be used.
// const getMessages = locale => {
// 	return require(`./lang/${locale}.json`);
// };

try {
	fs.statSync(path.join(__dirname, '.env'));
} catch (error) {
	console.error('-----------------------------------------------------');
	console.error('|                                                   |');
	console.error('|             File .env does not exist.             |');
	console.error('|                                                   |');
	console.error('-----------------------------------------------------');
	return;
}

app.prepare().then(() => {
	createServer((req, res) => {
		// const accept = accepts(req);
		// const locale = accept.language(accept.languages(supportedLanguages)) || 'en';
		// req.locale = 'fr';
		// req.localeDataScript = getLocaleDataScript('fr');
		// // req.messages = dev ? {} : getMessages(locale);
		// req.messages = getMessages('fr');
		handler(req, res);
	}).listen(port, err => {
		if (err) throw err;
		console.log(`> Ready on http://localhost:${port}`);
	});
});
