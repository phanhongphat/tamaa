// import { fromJS, Map } from 'immutable';

export const initialState = {
	error: {
		message: '',
		statusCode: 0
	},
	status: {}
};

export default (state = initialState, action) => {
	switch (action.type) {
		case 'LOGIN_SUCCESS':
			return { ...state, ...action.payload };
		case 'LOGIN_FAILED':
			return { error: { ...action.payload } };
		case 'FORGOT_PASSWORD_SUCCESS':
			return { ...state, error: { ...action.payload } };
		case 'FORGOT_PASSWORD_FAILED':
			return { ...state, error: action.payload };
		case 'CHANGE_PASSWORD_SUCCESS':
			return { ...state, status: { ...action.payload } };
		case 'VERIFY_CATOKEN_REQUEST':
			return { ...state, status: action.payload };
		case 'VERIFY_CATOKEN_SUCCESS':
			return { ...state, status: { ...action.payload } };
		case 'RESET_FIRST_PASSWORD_REQUEST':
			return { ...state, status: action.payload };
		case 'RESET_FIRST_PASSWORD_SUCCESS':
			return { ...state, status: { ...action.payload } };
		case 'RESET_FIRST_PINCODE_REQUEST':
			return { ...state, status: action.payload };
		case 'RESET_FIRST_PINCODE_SUCCESS':
			return { ...state, status: { ...action.payload } };
		default:
			return state;
	}
};
