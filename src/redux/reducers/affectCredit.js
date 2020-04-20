export const initialState = {
	message: {
		data: {},
		loading: true
	}
};

export default (state = initialState, action) => {
	switch (action.type) {
		case 'AFFECT_CREDIT_REQUEST':
			return { ...state, message: { ...initialState } };
		case 'AFFECT_CREDIT_SUCCESS':
			const data = { ...state.message.data, ...action.payload };
			return { ...state, message: { data, loading: false } };
		default:
			return state;
	}
};
