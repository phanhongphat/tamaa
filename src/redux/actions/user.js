import { SINGLE_API } from 'src/redux/actions/type';

export const getListUser = (payload, next, nextErr) => {
	// const { pagination, page, itemsPerPage, email, username } = payload;
	return {
		type: SINGLE_API,
		payload: {
			uri: '/users',
			params: payload,
			beforeCallType: 'GET_USER_LIST_REQUEST',
			successType: 'GET_USER_LIST_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const getUserInfo = (payload, next, nextErr) => {
	// const { pagination, page, itemsPerPage, email, username } = payload;
	const { id } = payload;
	return {
		type: SINGLE_API,
		payload: {
			uri: `/users/${id}`,
			// params: payload,
			beforeCallType: 'GET_USER_DETAIL_REQUEST',
			successType: 'GET_USER_DETAIL_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const updateUserInfor = (payload, next, nextErr) => {
	// const { pagination, page, itemsPerPage, email, username } = payload;
	const { id } = payload;
	return {
		type: SINGLE_API,
		payload: {
			opt: { method: 'PUT' },
			uri: `/users/${id}`,
			params: payload,
			beforeCallType: 'UPDATE_USER_DETAIL_REQUEST',
			successType: 'UPDATE_USER_DETAIL_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const deactiveMultipleUser = (payload, next, nextErr) => {
	// const { pagination, page, itemsPerPage, email, username } = payload;
	return {
		type: SINGLE_API,
		payload: {
			opt: { method: 'PUT' },
			uri: '/users/mass_update/activated',
			params: payload,
			beforeCallType: 'UPDATE_USER_DETAIL_REQUEST',
			successType: 'UPDATE_USER_DETAIL_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const createUserRequest = (payload = {}, next, nextErr) => {
	return {
		type: SINGLE_API,
		payload: {
			opt: { method: 'POST' },
			uri: '/users',
			params: { ...payload },
			beforeCallType: 'CREATE_USER_REQUEST',
			successType: 'CREATE_USER_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const deleteUser = (payload = {}, next, nextErr) => {
	const { id } = payload;
	return {
		type: SINGLE_API,
		payload: {
			uri: `/users/${id}`,
			opt: { method: 'DELETE' },
			beforeCallType: 'DELETE_USER_REQUEST',
			successType: 'DELETE_USER_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};
export const deactivatedUsersRequest = (payload, next, nextErr) => {
	// const { pagination, page, itemsPerPage, email, username } = payload;
	return {
		type: SINGLE_API,
		payload: {
			opt: { method: 'PUT' },
			uri: '/users/mass_update/activated',
			params: payload,
			beforeCallType: 'DEACTIVATED_USERS_REQUEST',
			successType: 'DEACTIVATED_USERS_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};
