import { SINGLE_API } from 'src/redux/actions/type';

// export const MODEL_NAME = 'USER';
// export const MODEL_PLURAL = 'users';

export const getListCreditDetails = (next, nextErr) => {
	// const { filter, firstLoad } = payload;

	return {
		type: SINGLE_API,
		payload: {
			uri: '/employees',
			beforeCallType: 'GET_CREDITS_DETAILS_LIST_REQUEST',
			successType: 'GET_CREDITS_DETAILS_LIST__SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

//export const deleteEmployees = (payload = {}, next, nextErr) => {};
