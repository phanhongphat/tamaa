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
};

export default (state = initialState, action) => {
	switch (action.type) {
		case 'GET_LIST_ISLAND_REQUEST':
			return { ...state, list: { ...initialState.list } };
		case 'GET_LIST_ISLAND_SUCCESS': {
			if (action.payload && isArray(action.payload)) {
				const data = [...state.list.data, ...action.payload];
				return { ...state, list: { data, loading: false } };
			}
			return { ...state };
		}
        case 'GET_ISLAND_DETAILS_REQUEST':
            return { ...state, list: { ...initialState.list } };
        case 'GET_ISLAND_DETAILS_SUCCESS':
            return { ...state, details: { data: action.payload, loading: false } };
        case 'CREATE_ISLAND_REQUEST':
            return { ...state, detail: { ...initialState.detail }, error: { ...initialState.error } };
        case 'CREATE_ISLAND_SUCCESS': {
            if (action.payload.title && action.payload.title === 'An error occurred') {
                return { ...state, error: { ...action.payload } };
            }
            return { ...state };
        }
        case 'UPDATE_ISLAND_REQUEST':
            return { ...state, detail: { ...initialState.detail } };
        case 'UPDATE_ISLAND_SUCCESS': {
            return { ...state, detail: { data: { ...action.payload }, loading: false } };
        }
		default:
			return state;
	}
};
