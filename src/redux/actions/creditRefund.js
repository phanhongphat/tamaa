import { SINGLE_API } from 'src/redux/actions/type';

// export const MODEL_NAME = 'USER';
// export const MODEL_PLURAL = 'users';

export const refundRestaurant = (payload = {}, next, nextErr) => {
	// const { filter, firstLoad } = payload;

	return {
		type: SINGLE_API,
		payload: {
			uri: '/refund',
			opt: { method: 'POST' },
			params: { ...payload },
			beforeCallType: 'REFUND_RESTAURANT_REQUEST',
			successType: 'REFUND_RESTAURANT_SUCCESSFUL',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};
