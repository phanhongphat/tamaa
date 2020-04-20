// import AuthStorage from 'src/utils/AuthStorage';

import { SINGLE_API } from 'src/redux/actions/type';

export function loginRequest(payload, next, nextErr) {
	return {
		type: 'LOGIN_REQUEST',
		payload,
		next,
		nextErr
	};
}

export function logoutRequest(next) {
	return {
		type: 'LOGOUT_REQUEST',
		next
	};
}

export function registerRequest(payload = {}, next, nextErr) {
	return {
		type: 'REGISTER_REQUEST',
		payload,
		next,
		nextErr
	};
}

export function forgotPasswordRequest(payload = {}, next, nextErr) {
	return {
		type: 'FORGOT_PASSWORD_REQUEST',
		payload,
		next,
		nextErr
	};
}

export function changePasswordRequest(payload = {}, next, nextErr) {
	const { params } = payload;
	return {
		type: SINGLE_API,
		payload: {
			opt: { method: 'POST' },
			uri: '/change_password',
			params,
			beforeCallType: 'CHANGE_PASSWORD_REQUEST',
			successType: 'CHANGE_PASSWORD_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
}

export function verifyCaTokenRequest(payload, next, nextErr) {
	const { params } = payload;

	return {
		type: SINGLE_API,
		payload: {
			opt: { method: 'POST' },
			uri: '/verify/catoken',
			params,
			beforeCallType: 'VERIFY_CATOKEN_REQUEST',
			successType: 'VERIFY_CATOKEN_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
}

export function verifyRPTokenRequest(payload, next, nextErr) {
	const { params } = payload;

	return {
		type: SINGLE_API,
		payload: {
			opt: { method: 'POST' },
			uri: '/verify/rpin-token',
			params,
			beforeCallType: 'VERIFY_CATOKEN_REQUEST',
			successType: 'VERIFY_CATOKEN_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
}

export function resetFirstPasswordRequest(payload, next, nextErr) {
	const { params } = payload;

	return {
		type: SINGLE_API,
		payload: {
			opt: { method: 'POST' },
			uri: '/reset-first-password',
			params,
			beforeCallType: 'RESET_FIRST_PASSWORD_REQUEST',
			successType: 'RESET_FIRST_PASSWORD_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
}

export function resetFirstPinCodeRequest(payload, next, nextErr) {
	const { params } = payload;

	return {
		type: SINGLE_API,
		payload: {
			opt: { method: 'POST' },
			uri: '/reset-pincode',
			params,
			beforeCallType: 'RESET_FIRST_PINCODE_REQUEST',
			successType: 'RESET_FIRST_PINCODE_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
}
