/* eslint-disable prefer-template */
import merge from 'lodash/merge';
import { put, call } from 'redux-saga/effects';

import Router from 'next/router';
import AuthStorage from 'src/utils/AuthStorage';

import API from '../constants/url';
import ENV from '../constants/env';

import { REQUEST_ERROR } from '../redux/actions/type';
// import { generateUniqueFileName } from 'src/utils';

// const compressOpt = {
// 	quality: 0.8,
// 	convertSize: 5000000 // PNG files over this value will be converted to JPEGs
// };

const { API_URL } = API;

export const fetching = (url, options) =>
	fetch(API_URL + url, options)
		.then(response => {
			return response.status === 204 || response.statusText === 'No Content' ? {} : response.json();
			// return response.status === 204 || response.statusText === 'No Content' ? {} : response;
		})
		.then(json => {
			if (json.error) {
				throw json.error;
			} else {
				// console.log('json ===>', json);
				return json;
			}
		})
		.catch(err => {
			throw err;
		});

/* The example data is structured as follows:

Params: {
	uri: ,
	params: ,
	opt: ,
	loading: ,
	uploadFile: ,
}
*/

export default function*({ uri, params = {}, opt = {}, loading = true, uploadFile = false }) {
	const defaultOptions = {
		method: 'GET',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			'Accept-Language': 'fr'
		}
	};

	if (!uri) {
		return;
	}

	const options = merge(defaultOptions, opt);

	if (uploadFile && params.files) {
		options.headers = {};
	}

	// set token
	if (AuthStorage.loggedIn) {
		options.headers.Authorization = `Bearer ${AuthStorage.token}`;
	}

	let url = uri;

	if (params && Object.keys(params).length > 0) {
		if (options && options.method === 'GET') {
			url +=
				'?' +
				Object.keys(params)
					.map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
					.join('&');
		} else if (uploadFile && params.files) {
			const formData = new FormData();
			// const imageCompressor = new ImageCompressor();
			// 	// console.log(file.name + 'before', file.size);
			// 	return imageCompressor.compress(file, compressOpt);
			// });
			// const files = yield Promise.all(fileCompressionPromises);
			if (Array.isArray(params.files)) {
				params.files.forEach(file => {
					formData.append(file.field, file.file);
				});
			}
			console.log('formData', ...formData);
			//singleFile
			options.body = formData;
		} else {
			options.body = JSON.stringify(params);
		}
	}

	if (loading) {
		yield put({ type: 'TOGGLE_LOADING' });
	}

	let response;
	try {
		if (ENV !== 'production') {
			console.info('====> Call' + url, ', options=', options);
		}

		response = yield call(fetching, url, options);

		if (loading) {
			yield put({ type: 'TOGGLE_LOADING' });
		}
	} catch (error) {
		response = { error };

		if (error.message !== 'Unexpected end of JSON input') {
			if (error.statusCode === 401 && error.code !== 'ACCOUNT_DISABLED') {
				// Access token has expired
				if (error.code === 'INVALID_TOKEN') {
					// if (AuthStorage.loggedIn) {
					//  yield put({ type: 'LOGOUT_SUCCESS' });
					// }

					yield put({ type: REQUEST_ERROR, payload: 'Access token has expired' });
					Router.push('/login');
				}
				if (error.code === 'AUTHORIZATION_REQUIRED') {
					yield put({
						type: REQUEST_ERROR,
						payload: "You don't have permission for this action!"
					});
				}
			} else if (error.statusCode === 401 && error.code === 'ACCOUNT_DISABLED') {
				// Access token has expired
				// if (AuthStorage.loggedIn) {
				//  yield put({ type: 'LOGOUT_SUCCESS' });
				// }

				yield put({ type: REQUEST_ERROR, payload: 'Account has been disabled' });
				Router.push('/login');
			} else {
				yield put({ type: REQUEST_ERROR, payload: error.message || error });
			}
		}
	}

	return response;
}
