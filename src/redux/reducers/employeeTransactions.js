// import { fromJS, Map } from 'immutable';

export const initialState = {
	list: {
		data: [],
		loading: true
	}
};

export default (state = initialState, action) => {
	switch (action.type) {
		case 'GET_EMPLOYEE_LIST_TRANSACTIONS_REQUEST':
			return { ...state, list: { ...initialState.list } };

		case 'GET_EMPLOYEE_LIST_TRANSACTIONS__SUCCESS': {
			const data = [...state.list.data, ...action.payload];
			return { ...state, list: { data, loading: false } };
		}
		case 'LOGIN_FAILED':
			return { error: action.payload.message || action.payload };
		default:
			return state;
	}
};
