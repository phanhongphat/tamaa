import { SINGLE_API } from 'src/redux/actions/type';

// export const MODEL_NAME = 'USER';
// export const MODEL_PLURAL = 'users';

export const getListTransactions = (payload, next, nextErr) => {
	// const { filter, firstLoad } = payload;
	return {
		type: SINGLE_API,
		payload: {
			uri: '/transactions',
			params: payload,
			beforeCallType: 'GET_TRANSACTION_LIST_REQUEST',
			successType: 'GET_TRANSACTION_LIST_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};
export const filterTransactions = (payload, next, nextErr) => {
	// const { before, after } = payload;
	// console.log(`/transactions.json?date[before]=${before}&date[after]=${after}`);
	return {
		type: SINGLE_API,
		payload: {
			// uri: `/transactions.json?date[before]=${before}&date[after]=${after}&pagination=false&type[0]=1`,
			uri: '/transactions',
			params: payload,
			beforeCallType: 'FILTER_TRANSACTIONS_REQUEST',
			successType: 'FILTER_TRANSACTIONS_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const getTransactionsByUserId = (payload, next, nextErr) => {
	// const { filter, firstLoad } = payload;
	return {
		type: SINGLE_API,
		payload: {
			uri: '/transactions/search',
			params: payload,
			beforeCallType: 'GET_TRANSACTION_BY_USER_ID_REQUEST',
			successType: 'GET_TRANSACTION_BY_USER_ID_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const getTransactionsByUserIdOfEmployee = (payload, next, nextErr) => {
	// const { filter, firstLoad } = payload;
	return {
		type: SINGLE_API,
		payload: {
			uri: '/transactions',
			params: payload,
			beforeCallType: 'GET_TRANSACTION_BY_USER_ID_REQUEST',
			successType: 'GET_TRANSACTION_BY_USER_ID_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const getCreditsByUserId = (payload, next, nextErr) => {
	// const { filter, firstLoad } = payload;
	return {
		type: SINGLE_API,
		payload: {
			uri: '/transactions/search',
			params: payload,
			beforeCallType: 'GET_CREDIT_BY_USER_ID_REQUEST',
			successType: 'GET_CREDIT_BY_USER_ID_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const getCreditsByUserIdOnEmployee = (payload, next, nextErr) => {
	// const { filter, firstLoad } = payload;
	return {
		type: SINGLE_API,
		payload: {
			uri: '/transactions',
			params: payload,
			beforeCallType: 'GET_CREDIT_BY_USER_ID_REQUEST',
			successType: 'GET_CREDIT_BY_USER_ID_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};
