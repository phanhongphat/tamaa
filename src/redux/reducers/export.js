export const initialState = {
	detail: {
		data: {},
		loading: true
	}};

export default (state = initialState, action) => {
	switch(action.type) {
		case 'EXPORT_COMPANY_REQUEST':	
			return { ...state }
		case 'EXPORT_COMPANY_SUCCESS':
			console.log(action.payload)
			return { ...state, detail: { data: { ...action.payload }, loading : false} }
		default:
			return state
	}
}
