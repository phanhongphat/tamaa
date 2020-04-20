// import { fromJS, Map } from 'immutable';
import isArray from 'lodash/isArray';

export const initialState = {
	list: {
		data: [],
		loading: true
	},
	details: {
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
		case 'GET_RESTAURANT_LIST_REQUEST':
			return { ...state, list: { ...initialState.list } };
		case 'GET_RESTAURANT_LIST_SUCCESS': {
			if (action.payload && isArray(action.payload)) {
				const data = [...state.list.data, ...action.payload];
				return { ...state, list: { data, loading: false } };
			}
			return { ...state };
		}
		case 'GET_RESTAURANT_DETAIL_REQUEST':
			return { ...state, list: { ...initialState.list } };
		case 'GET_RESTAURANT_DETAIL_SUCCESS':
			return { ...state, details: { data: action.payload, loading: false } };
		case 'CREATE_RESTAURANT_REQUEST':
			return { ...state };
		case 'CREATE_RESTAURANT_SUCCESS':
			if (action.payload && action.payload.title === 'An error occurred') {
				return { ...state, error: { ...action.payload } };
			}
			return { ...state };
		// case 'DELETE_RESTAURANT_REQUEST':
		// 	return { ...state };
		// case 'DELETE_RESTAURANT_SUCCESS': {
		// 	const datas = findId(action.payload.id, state.list.data);
		// 	return { ...state, list: { data: [...datas], loading: false } };
		// }
		// case 'EDIT_RESTAURANT_REQUEST':
		// 	return { ...state };
		// case 'EDIT_RESTAURANT_SUCCESS':
		//     return { ...state, details: { data: action.payload, loading: false } };
		case 'GET_LIST_SEARCH_RESTAURANT_REQUEST': {
			return { ...state, searchList: { ...initialState.searchList } };
		}
		case 'GET_LIST_SEARCH_RESTAURANT_SUCCESS': {
			if (action.payload && isArray(action.payload)) {
				const data = action.payload.length > 0 ? [...action.payload] : [];
				return { ...state, searchList: { data, loading: false } };
			}
			return { ...state };
		}

		default:
			return state;
	}
};
