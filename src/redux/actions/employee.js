import { SINGLE_API } from 'src/redux/actions/type';

// export const MODEL_NAME = 'USER';
// export const MODEL_PLURAL = 'users';

export const getListEmployees = (payload, next, nextErr) => {
	// const { filter, firstLoad } = payload;

	return {
		type: SINGLE_API,
		payload: {
			uri: '/employees',
			params: payload,
			beforeCallType: 'GET_EMPLOYEE_LIST_REQUEST',
			successType: 'GET_EMPLOYEE_LIST_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const getEmployeeDetails = (payload = {}, next, nextErr) => {
	const { id } = payload;
	return {
		type: SINGLE_API,
		payload: {
			uri: `/employees/${id}`,
			beforeCallType: 'GET_EMPLOYEE_DETAILS_REQUEST',
			successType: 'GET_EMPLOYEE_DETAILS_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const deleteEmployees = (payload = {}, next, nextErr) => {
	const { id } = payload;
	return {
		type: SINGLE_API,
		payload: {
			opt: { method: 'DELETE' },
			uri: `/employees/${id}`,
			beforeCallType: 'DELETE_EMPLOYEE_REQUEST',
			successType: 'DELETE_EMPLOYEE_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};
export const editEmployeeRequest = (payload = {}, next, nextErr) => {
	// const { filter, firstLoad } = payload;
	const { id } = payload;
	return {
		type: SINGLE_API,
		payload: {
			opt: { method: 'PUT' },
			uri: `/employees/${id}`,
			params: { ...payload },
			beforeCallType: 'EDIT_EMPLOYEE_REQUEST',
			successType: 'EDIT_EMPLOYEE_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};
export const createNewEmployee = (payload = {}, next, nextErr) => {
	// const { filter, firstLoad } = payload;

	console.log('createNewEmployee ==>', payload);
	return {
		type: SINGLE_API,
		payload: {
			opt: { method: 'POST' },
			uri: '/employees',
			params: { ...payload },
			beforeCallType: 'CREATE_NEW_EMPLOYEE_REQUEST',
			successType: 'CREATE_NEW_EMPLOYEE_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const searchEmployee = (payload = {}, next, nextErr) => {
	const { params } = payload;
	return {
		type: SINGLE_API,
		payload: {
			uri: '/employees/search',
			params,
			beforeCallType: 'GET_EMPLOYEE_SEARCH_REQUEST',
			successType: 'GET_EMPLOYEE_SEARCH_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};
