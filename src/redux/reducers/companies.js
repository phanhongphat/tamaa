// import { fromJS, Map } from 'immutable';

import _ from 'lodash';

export const initialState = {
	list: {
		data: [],
		loading: true
	},
	detail: {
		data: {},
		loading: true
	},
	searchList: {
		data: [],
		loading: true
	},
	error: {}
};

export default (state = initialState, action) => {
	switch (action.type) {
		case 'GET_COMPANY_LIST_REQUEST':
			return { ...state, list: { ...initialState.list } };

		case 'GET_COMPANY_LIST_SUCCESS': {
			const data = action.payload.length > 0 ? [...state.list.data, ...action.payload] : [];
			return { ...state, list: { data, loading: false } };
		}
		case 'GET_COMPANY_SEARCH_REQUEST':
			return { ...state, searchList: { ...initialState.searchList } };

		case 'GET_COMPANY_SEARCH_SUCCESS': {
			const data = action.payload.length > 0 ? [...action.payload] : [];
			return { ...state, searchList: { data, loading: false } };
		}
		case 'GET_COMPANY_SEARCH_LIST_REQUEST':
			return { ...state, list: { ...initialState.searchList } };

		case 'GET_COMPANY_SEARCH_LIST_SUCCESS': {
			const data = action.payload.length > 0 ? [...action.payload] : [];
			return { ...state, list: { data, loading: false } };
		}
		case 'GET_COMPANY_DETAIL_REQUEST':
			return { ...state, detail: { ...initialState.detail } };
		case 'GET_COMPANY_DETAIL_SUCCESS': {
			return { ...state, detail: { data: { ...action.payload }, loading: false } };
		}
		case 'CREATE_COMPANY_REQUEST':
			return { ...state, error: { ...initialState.error } };
		case 'CREATE_COMPANY_SUCCESS':
			if (action.payload && action.payload.violations) {
				return { ...state, error: { ...action.payload } };
			}
			return { ...state, detail: { data: { ...action.payload }, loading: false } };
		case 'UPDATE_COMPANY_DETAIL_REQUEST':
			return { ...state };
		case 'UPDATE_COMPANY_DETAIL_SUCCESS':
			return { ...state, detail: { data: { ...action.payload }, loading: false } };
		default:
			return state;
	}
};
