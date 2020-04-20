import { SINGLE_API } from 'src/redux/actions/type';

// export const MODEL_NAME = 'USER';
// export const MODEL_PLURAL = 'users';

export const getListEmployeeTransactions = (next, nextErr) => {
	// const { filter, firstLoad } = payload;

	return {
		type: SINGLE_API,
		payload: {
			uri: '/employees',
			beforeCallType: 'GET_EMPLOYEE_LIST_TRANSACTIONS_REQUEST',
			successType: 'GET_EMPLOYEE_LIST_TRANSACTIONS__SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

//export const deleteEmployees = (payload = {}, next, nextErr) => {};
