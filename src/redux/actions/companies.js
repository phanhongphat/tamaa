import { SINGLE_API } from 'src/redux/actions/type';

// export const MODEL_NAME = 'USER';
// export const MODEL_PLURAL = 'users';

export const getListCompanies = (payload = {}, next, nextErr) => {
	// const { filter, firstLoad } = payload;

	return {
		type: SINGLE_API,
		payload: {
			uri: '/companies',
			params: payload,
			beforeCallType: 'GET_COMPANY_LIST_REQUEST',
			successType: 'GET_COMPANY_LIST_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};
export const getCompanieInfo = (payload = {}, next, nextErr) => {
	const { id } = payload;
	return {
		type: SINGLE_API,
		payload: {
			uri: `/companies/${id}`,
			beforeCallType: 'GET_COMPANY_DETAIL_REQUEST',
			successType: 'GET_COMPANY_DETAIL_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const getSearchCompanieInfo = (payload = {}, next, nextErr) => {
	const searchString = payload;
	return {
		type: SINGLE_API,
		payload: {
			uri: `/companies/search?query=${searchString}`,
			beforeCallType: 'GET_COMPANY_SEARCH_REQUEST',
			successType: 'GET_COMPANY_SEARCH_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const getSearchListCompanieInfo = (payload = {}, next, nextErr) => {
	return {
		type: SINGLE_API,
		payload: {
			uri: `/companies/search`,
			params: payload,
			beforeCallType: 'GET_COMPANY_SEARCH_LIST_REQUEST',
			successType: 'GET_COMPANY_SEARCH_LIST_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const updateCompanieInfo = (payload = {}, next, nextErr) => {
	const { id } = payload;
	return {
		type: SINGLE_API,
		payload: {
			opt: { method: 'PUT' },
			uri: `/companies/${id}`,
			params: { ...payload },
			beforeCallType: 'UPDATE_COMPANY_LIST_REQUEST',
			successType: 'UPDATE_COMPANY_DETAIL_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const deleteCompany = (payload = {}, next, nextErr) => {
	const { id } = payload;
	return {
		type: SINGLE_API,
		payload: {
			opt: { method: 'DELETE' },
			uri: `/companies/${id}`,
			beforeCallType: 'GET_DELETE_COMPANY_REQUEST',
			successType: 'GET_DELETE_COMPANY_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const createCompany = (payload = {}, next, nextErr) => {
	return {
		type: SINGLE_API,
		payload: {
			opt: { method: 'POST' },
			uri: '/companies',
			params: { ...payload },
			beforeCallType: 'CREATE_COMPANY_REQUEST',
			successType: 'CREATE_COMPANY_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};
export const deleteCompanies = (payload = {}, next, nextErr) => {};
