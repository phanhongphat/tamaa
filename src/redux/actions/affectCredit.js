import { SINGLE_API } from 'src/redux/actions/type';

export const affectCredit = (payload = {}, next, nextErr) => {
	return {
		type: SINGLE_API,
		payload: {
			opt: { method: 'POST' },
			params: payload,
			uri: '/affect_credit',
			beforeCallType: 'AFFECT_CREDIT_REQUEST',
			successType: 'AFFECT_CREDIT_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};
