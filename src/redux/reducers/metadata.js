// import { fromJS, Map } from 'immutable';

export const initialState = {
	list: {
		data: [],
		loading: true
	}
};

export default (state = initialState, action) => {
	switch (action.type) {
		case 'GET_METADATA_LIST_REQUEST':
			return { list: { ...initialState.list }, ...state };
		case 'GET_METADATA_LIST_SUCCESS': {
			const data = [...state.list.data, ...action.payload];
			return { ...state, list: { data, loading: false } };
		}
		case 'UPDATE_METADATA_LIST_REQUEST':
			return { ...state };
		default:
			return state;
	}
};
