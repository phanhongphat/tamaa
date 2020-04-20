import { SINGLE_API } from 'src/redux/actions/type';

export const getAmountInfotRequest = (payload, next, nextError) => {
	return {
		type: SINGLE_API,
		payload: {
			uri: '/dashboard/amount-info',
			params: payload,
			beforeCallType: 'GET_DASHBOARD_AMOUNT_INFOR_RESTAURANT_REQUEST',
			successType: 'GET_DASHBOARD_AMOUNT_INFOR_RESTAURANT_SUCCESS',
			afterSuccess: next,
			afterError: nextError
		}
	};
};

export const getTopIncomeRestaurant = (payload, next, nextError) => {
	return {
		type: SINGLE_API,
		payload: {
			uri: '/dashboard/top-income-restaurant',
			params: payload,
			beforeCallType: 'GET_DASHBOARD_INCOM_RESTAURANT_REQUEST',
			successType: 'GET_DASHBOARD_INCOM_RESTAURANT_SUCCESS',
			afterSuccess: next,
			afterError: nextError
		}
	};
};

export const getTopAffectCompany = (payload, next, nextError) => {
	return {
		type: SINGLE_API,
		payload: {
			uri: '/dashboard/top-affect-company',
			params: payload,
			beforeCallType: 'GET_DASHBOARD_AFFECT_COMPANY_REQUEST',
			successType: 'GET_DASHBOARD_AFFECT_COMPANY_SUCCESS',
			afterSuccess: next,
			afterError: nextError
		}
	};
};

export const getDashboardCompany = (payload, next, nextError) => {
	const { params } = payload;
	return {
		type: SINGLE_API,
		payload: {
			uri: '/dashboard/company',
			params,
			beforeCallType: 'GET_DASHBOARD_COMPANY_REQUEST',
			successType: 'GET_DASHBOARD_COMPANY_SUCCESS',
			afterSuccess: next,
			afterError: nextError
		}
	};
};

export const getDashboardRestaurent = (payload, next, nextError) => {
	const { params } = payload;
	return {
		type: SINGLE_API,
		payload: {
			uri: '/dashboard/restaurant',
			params,
			beforeCallType: 'GET_DASHBOARD_RESTAURANT_REQUEST',
			successType: 'GET_DASHBOARD_RESTAURANT_SUCCESS',
			afterSuccess: next,
			afterError: nextError
		}
	};
};
