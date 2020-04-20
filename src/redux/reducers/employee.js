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
	searchList: {
		data: [],
		loading: true
	},
	error: {}
};

const findId = (id, data) => {
	let outPut = [];
	const index = _.findIndex(data, o => o.id === id);
	if (index > -1) {
		outPut = data.splice(index, 1);
	}
	return outPut;
};

export default (state = initialState, action) => {
	switch (action.type) {
		case 'GET_EMPLOYEE_LIST_REQUEST':
			return { ...state, list: { ...initialState.list } };

		case 'GET_EMPLOYEE_LIST_SUCCESS': {
			if (action.payload && isArray(action.payload)) {
				const data = [...state.list.data, ...action.payload];
				return { ...state, list: { data, loading: false } };
			}
			return { ...state };
		}
		case 'GET_EMPLOYEE_DETAILS_REQUEST':
			return { ...state, detail: { ...initialState.detail } };

		case 'GET_EMPLOYEE_DETAILS_SUCCESS': {
			return { ...state, detail: { data: action.payload, loading: false } };
		}
		case 'DELETE_EMPLOYEE_REQUEST': {
			return { ...state };
		}
		case 'DELETE_EMPLOYEE_SUCCESS': {
			const data = findId(action.payload.id, state.list.data);
			return { ...state, list: { data: [...data], loading: false } };
		}
		case 'CREATE_NEW_EMPLOYEE_REQUEST': {
			return { ...state };
		}
		case 'CREATE_NEW_EMPLOYEE_SUCCESS': {
			console.log(action.payload);
			if (action.payload && action.payload.violations) {
				return { ...state, error: { ...action.payload } };
			}
			return { ...state, detail: { data: { ...action.payload }, loading: false } };
		}
		case 'EDIT_EMPLOYEE_REQUEST': {
			return { ...state };
		}
		case 'EDIT_EMPLOYEE_SUCCESS': {
			return { ...state, detail: { data: { ...action.payload }, loading: false } };
		}
		case 'GET_EMPLOYEE_SEARCH_REQUEST': {
			return { ...state, searchList: { ...initialState.searchList } };
		}
		case 'GET_EMPLOYEE_SEARCH_SUCCESS': {
			if (action.payload && action.payload.statusCode && action.payload.statusCode === 404) {
				return { ...state, error: { ...action.payload } };
			}
			if (action.payload && isArray(action.payload)) {
				const data = [...state.searchList.data, ...action.payload];
				return { ...state, searchList: { data, loading: false } };
			}
			return { ...state };
		}

		default:
			return state;
	}
};
