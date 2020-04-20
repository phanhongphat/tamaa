import { SINGLE_API } from 'src/redux/actions/type';

// export const MODEL_NAME = 'USER';
// export const MODEL_PLURAL = 'users';

export const getAffectionListEmployee = (next, nextErr) => {
	// const { filter, firstLoad } = payload;
	return {
		type: SINGLE_API,
		payload: {
			uri: '/employees',
			beforeCallType: 'GET_AFFECTION_LIST_REQUEST',
			successType: 'GET_AFFECTION_LIST_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};
