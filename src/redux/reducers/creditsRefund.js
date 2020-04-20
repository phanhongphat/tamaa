// import { fromJS, Map } from 'immutable';

export const initialState = {
	message: {}
};

export default (state = initialState, action) => {
	switch (action.type) {
		case 'REFUND_RESTAURANT_REQUEST':
			return { ...state, message: { ...initialState.message } };
		case 'REFUND_RESTAURANT_SUCCESSFUL': {
			return { ...state, message: { ...action.payload } };
		}
		default:
			return state;
	}
};
