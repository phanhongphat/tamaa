import isArray from 'lodash/isArray';

export const initialState = {
	list: {
		data: [],
		loading: true
	},
	listCredits: {
		data: [],
		loading: true
	}
};

export default (state = initialState, action) => {
	switch (action.type) {
		case 'GET_TRANSACTION_LIST_REQUEST':
			return { ...state, list: { ...initialState.list } };

		case 'GET_TRANSACTION_LIST_SUCCESS': {
			if (action.payload && isArray(action.payload)) {
				const data = [...state.list.data, ...action.payload];
				return { ...state, list: { data, loading: false } };
			}
			return { ...state };
		}
		case 'GET_TRANSACTION_BY_USER_ID_REQUEST':
			return { ...state, list: { data: [] } };

		case 'GET_TRANSACTION_BY_USER_ID_SUCCESS': {
			const data = [...action.payload];
			return { ...state, list: { data, loading: false } };
		}
		case 'GET_CREDIT_BY_USER_ID_REQUEST':
			return { ...state, listCredits: { ...initialState.listCredits } };

		case 'GET_CREDIT_BY_USER_ID_SUCCESS': {
			if (action.payload.statusCode && action.payload.statusCode === 404) {
				return { ...state };
			}
			const data = [...state.listCredits.data, ...action.payload];
			return { ...state, listCredits: { data, loading: false } };
		}
		case 'FILTER_TRANSACTIONS_REQUEST':
			return { ...state, list: { ...initialState.list } };

		case 'FILTER_TRANSACTIONS_SUCCESS': {
			const data = [...state.list.data, ...action.payload];
			return { ...state, list: { data, loading: false } };
		}
		case 'LOGIN_FAILED':
			return { error: action.payload.message || action.payload };
		default:
			return state;
	}
};
