import { takeEvery, call, put } from 'redux-saga/effects';
import Router from 'next/router';

import fetchApi from 'src/utils/FetchApi';

import { SINGLE_API } from 'src/redux/actions/type';

function* callApi(action) {
	if (action.type === SINGLE_API) {
		/* payload sample
		{
			uri: ,
			params: ,
			opt: ,
			loading: ,
			uploadFile: ,
			beforeCallType: 'CLEAR_CACHE_FEEDS_FB',
			afterCallType: 'CLEAR_CACHE_FEEDS_FB',
			successType: 'GET_CART_LIST_SUCCESS',
			afterSuccess: next,
			errorType: 'GET_CART_LIST_SUCCESS',
			afterError: next,
		}
		*/

		const {
			successType,
			beforeCallType,
			afterCallType,
			afterSuccess,
			errorType,
			afterError,
			...rest
		} = action.payload;

		if (beforeCallType) {
			yield put({ type: beforeCallType });
		}

		const response = yield call(fetchApi, rest);

		if (afterCallType) {
			yield put({ type: afterCallType });
		}
		if (response && response.code !== 401) {
			if (successType) {
				yield put({ type: successType, payload: response });
			}

			if (typeof afterSuccess === 'function') {
				afterSuccess(response);
			}
		} else {
			if (response.code === 401) {
				yield put({ type: 'LOGOUT_REQUEST' });
				Router.push('/login');
			}

			if (errorType) {
				yield put({ type: errorType, payload: response.error });
			}

			if (typeof afterError === 'function') {
				afterError(response.error);
			}
		}
	}
}

export default function*() {
	yield takeEvery('*', callApi);
}
