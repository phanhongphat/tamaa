export const initialState = {
	amountInfo: {
		data: {},
		loading: false
	},
	incomeRestaurant: {
		data: [],
		loading: false
	},
	affectCompany: {
		data: [],
		loading: false
	},
	restaurant: {
		data: {},
		loading: false
	},
	company: {
		data: {},
		loading: false
	}
};

export default (state = initialState, action) => {
	switch (action.type) {
		case 'GET_DASHBOARD_AMOUNT_INFOR_RESTAURANT_REQUEST':
			return { ...state, company: { ...initialState.amountInfo } };
		case 'GET_DASHBOARD_AMOUNT_INFOR_RESTAURANT_SUCCESS': {
			if (action.payload && action.payload.statusCode === 616) {
				return { ...state, amountInfo: { data: {}, loading: false } };
			}
			return { ...state, amountInfo: { data: { ...action.payload }, loading: false } };
		}
		case 'GET_DASHBOARD_INCOM_RESTAURANT_REQUEST':
			return { ...state, incomeRestaurant: { ...initialState.incomeRestaurant } };
		case 'GET_DASHBOARD_INCOM_RESTAURANT_SUCCESS': {
			if (action.payload && action.payload.statusCode === 616) {
				return { ...state, incomeRestaurant: { data: [], loading: false } };
			}

			const data = [...state.incomeRestaurant.data, ...action.payload];
			return { ...state, incomeRestaurant: { data, loading: false } };
		}
		case 'GET_DASHBOARD_AFFECT_COMPANY_REQUEST':
			return { ...state, affectCompany: { ...initialState.affectCompany } };
		case 'GET_DASHBOARD_AFFECT_COMPANY_SUCCESS': {
			if (action.payload && action.payload.statusCode === 616) {
				return { ...state, affectCompany: { data: [], loading: false } };
			}
			const data = [...action.payload];
			return { ...state, affectCompany: { data, loading: false } };
		}
		case 'GET_DASHBOARD_COMPANY_REQUEST':
			return { ...state, company: { ...initialState.company } };
		case 'GET_DASHBOARD_COMPANY_SUCCESS': {
			if (action.payload && action.payload.statusCode === 616) {
				return { ...state, company: { data: {}, loading: false } };
			}
			return { ...state, company: { data: { ...action.payload }, loading: false } };
		}
		case 'GET_DASHBOARD_RESTAURANT_REQUEST':
			return { ...state, restaurant: { ...initialState.restaurant } };
		case 'GET_DASHBOARD_RESTAURANT_SUCCESS': {
			if (action.payload && action.payload.statusCode === 616) {
				return { ...state, restaurant: { data: {}, loading: false } };
			}
			return { ...state, restaurant: { data: { ...action.payload }, loading: false } };
		}
		default:
			return state;
	}
};
