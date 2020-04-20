export default (state = initialState, action) => {
	switch (action.type) {
		case 'UPDATE_RESTAURANT_IMAGE_REQUEST':
			return { ...state };
		case 'UPDATE_RESTAURANT_IMAGE_SUCCESS':
			if (action.payload && action.payload.title === 'An error occurred') {
				return { ...state, error: { ...action.payload } };
			}
			return { ...state };
		default:
			return state;
	}
};
