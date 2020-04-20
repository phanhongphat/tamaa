import { take, call, cancel, fork, put } from 'redux-saga/effects';

import AuthStorage from 'src/utils/AuthStorage';
import fetchApi from 'src/utils/FetchApi';

import { REQUEST_ERROR } from 'src/redux/actions/type';

function* authorize(payload, next, nextErr) {
	const response = yield call(fetchApi, {
		uri: '/login',
		params: payload,
		opt: { method: 'POST' },
		loading: false
	});

	if (response && response.accessToken) {
		const data = {
			token: response.accessToken,
			userId: response.userID,
			role: response.roles[0],
			idInfo: response.IDInfo,
			email: response.username,
			name: `${response.firstName || ''} ${response.lastName || ''}`
		};

		AuthStorage.value = data;

		yield put({
			type: 'LOGIN_SUCCESS',
			payload: data
		});

		if (typeof next === 'function') {
			next();
		}
	} else {
		yield put({
			type: 'LOGIN_FAILED',
			payload: response
		});
		if (typeof nextErr === 'function') {
			nextErr();
		}
	}
}

function* loginFlow() {
	const INFINITE = true;
	while (INFINITE) {
		const { payload, next, nextErr } = yield take('LOGIN_REQUEST');
		const authorizeTask = yield fork(authorize, payload, next, nextErr);
		const action = yield take(['LOGOUT_REQUEST', 'LOGIN_FAILED', REQUEST_ERROR]);

		if (action.type === 'LOGOUT_REQUEST') {
			yield cancel(authorizeTask);
		}
	}
}

function* logoutFlow() {
	const INFINITE = true;

	while (INFINITE) {
		const { next } = yield take('LOGOUT_REQUEST');

		yield call(fetchApi, {
			uri: '/logout',
			opt: {
				method: 'POST',
				header: {
					Authorization: AuthStorage.token
				}
			}
		});

		yield call(AuthStorage.destroy);

		yield put({ type: 'LOGOUT_SUCCESS' });

		if (typeof next === 'function') {
			next();
		}
	}
}

function* registerFlow() {
	const INFINITE = true;

	while (INFINITE) {
		const { payload, next, nextErr } = yield take('REGISTER_REQUEST');
		const data = {
			...payload,
			realm: 'admin',
			emailVerified: false
		};
		const response = yield call(fetchApi, {
			uri: '/Users',
			params: data,
			opt: { method: 'POST' },
			loading: false
		});

		if (response && !response.error) {
			if (typeof next === 'function') {
				next();
			}
		}

		if (typeof nextErr === 'function') {
			nextErr();
		}
	}
}

function* forgotPasswordFlow() {
	const INFINITE = true;

	while (INFINITE) {
		const { payload, next, nextErr } = yield take('FORGOT_PASSWORD_REQUEST');

		const response = yield call(fetchApi, {
			uri: '/forgotpassword',
			params: payload,
			opt: { method: 'POST' }
		});

		if (response && !response.error) {
			yield put({ type: 'FORGOT_PASSWORD_SUCCESS', payload: response });

			if (typeof next === 'function') {
				next();
			}
		} else {
			yield put({ type: 'FORGOT_PASSWORD_FAILED', payload: response });

			if (typeof nextErr === 'function') {
				nextErr();
			}
		}
	}
}

export default function* authFlow() {
	yield fork(loginFlow);
	yield fork(logoutFlow);
	yield fork(registerFlow);
	yield fork(forgotPasswordFlow);
}
