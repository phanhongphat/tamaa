import { SINGLE_API } from 'src/redux/actions/type';

// export const MODEL_NAME = 'RESTAURANT';
// export const MODEL_PLURAL = 'restaurants';

export const getListRestaurant = (payload = { pagination: false }, next, nextErr) => {
	// const { filter, firstLoad } = payload;

	return {
		type: SINGLE_API,
		payload: {
			uri: '/restaurants',
			params: payload,
			beforeCallType: 'GET_RESTAURANT_LIST_REQUEST',
			successType: 'GET_RESTAURANT_LIST_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const getSearchListRestaurant = (payload = {}, next, nextErr) => {
	return {
		type: SINGLE_API,
		payload: {
			uri: '/restaurants/search',
			params: payload,
			beforeCallType: 'GET_LIST_SEARCH_RESTAURANT_REQUEST',
			successType: 'GET_LIST_SEARCH_RESTAURANT_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const getDetailRestaurant = (payload, next, nextErr) => {
	// const { filter, firstLoad } = payload;
	const { id } = payload;
	return {
		type: SINGLE_API,
		payload: {
			uri: `/restaurants/${id}`,
			beforeCallType: 'GET_RESTAURANT_DETAIL_REQUEST',
			successType: 'GET_RESTAURANT_DETAIL_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const createRestaurant = (payload = {}, next, nextErr) => {
	return {
		type: SINGLE_API,
		payload: {
			opt: { method: 'POST' },
			uri: '/restaurants',
			params: { ...payload },
			beforeCallType: 'CREATE_RESTAURANT_REQUEST',
			successType: 'CREATE_RESTAURANT_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const deleteRestaurant = (payload = {}, next, nextErr) => {
	const { id } = payload;
	return {
		type: SINGLE_API,
		payload: {
			opt: { method: 'DELETE' },
			uri: `/restaurants/${id}`,
			beforeCallType: 'DELETE_RESTAURANT_REQUEST',
			successType: 'DELETE_RESTAURANT_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const editRestaurant = (payload = {}, next, nextErr) => {
	const { id } = payload;
	return {
		type: SINGLE_API,
		payload: {
			opt: { method: 'PUT' },
			uri: `/restaurants/${id}`,
			params: { ...payload },
			beforeCallType: 'EDIT_RESTAURANT_REQUEST',
			successType: 'EDIT_RESTAURANT_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const pushNotificationRequest = (payload = {}, next, nextErr) => {
	return {
		type: SINGLE_API,
		payload: {
			opt: { method: 'POST' },
			uri: '/restaurant-notification',
			params: payload,
			beforeCallType: 'PUSH_NOTIFICATION_RESTAURANT_REQUEST',
			successType: 'PUSH_NOTIFICATION_RESTAURANT_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const getSearchListRestaurantRequest = (payload = {}, next, nextErr) => {
	return {
		type: SINGLE_API,
		payload: {
			uri: '/restaurants/search',
			params: payload,
			beforeCallType: 'GET_LIST_SEARCH_RESTAURANT_REQUEST',
			successType: 'GET_LIST_SEARCH_RESTAURANT_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const exportRestaurantsQRCode = (payload = {}, next, nextErr) => {
	return {
		type: SINGLE_API,
		payload: {
			opt: { method: 'POST' },
			uri: '/restaurants/export',
			params: { ...payload },
			beforeCallType: 'EXPORT_RESTAURANT_QRCODE_REQUEST',
			successType: 'EXPORT_RESTAURANT_QRCODE_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};
