// import { fromJS, Map } from 'immutable';
import isArray from 'lodash/isArray';

export const initialState = {
	list: {
		data: [],
		loading: true
	},
	detail: {
		data: {},
		loading: true
	},
	error: {},
	messageDetail: {}
};

export default (state = initialState, action) => {
	switch (action.type) {
		case 'GET_USER_LIST_REQUEST':
			return { ...state, list: { ...initialState.list } };
		case 'GET_USER_LIST_SUCCESS': {
			if (action.payload && isArray(action.payload)) {
				const data = [...state.list.data, ...action.payload];
				return { ...state, list: { data, loading: false } };
			}

			return { ...state };
		}
		case 'GET_USER_DETAIL_REQUEST':
			return { ...state, detail: { ...initialState.detail } };
		case 'GET_USER_DETAIL_SUCCESS': {
			return { ...state, detail: { data: { ...action.payload }, loading: false } };
		}
		case 'CREATE_USER_REQUEST':
			return { ...state, detail: { ...initialState.detail }, error: { ...initialState.error } };
		case 'CREATE_USER_SUCCESS': {
			if (action.payload.title && action.payload.title === 'An error occurred') {
				return { ...state, error: { ...action.payload } };
			}
			return { ...state };
		}
		case 'UPDATE_USER_DETAIL_REQUEST':
			return { ...state, detail: { ...initialState.detail } };
		case 'UPDATE_USER_DETAIL_SUCCESS': {
			return { ...state, detail: { data: { ...action.payload }, loading: false } };
		}
		case 'DEACTIVATED_USERS_REQUEST':
			return { ...state, messageDetail: { ...initialState.messageDetail } };

		case 'DEACTIVATED_USERS_SUCCESS': {
			const data = { ...state.messageDetail, ...action.payload };
			return { ...state, messageDetail: { data, loading: false } };
		}
		default:
			return state;
	}
};
