import { SINGLE_API } from 'src/redux/actions/type';

// export const MODEL_NAME = 'METADATA';
// export const MODEL_PLURAL = 'information_centres';

export const getListMetadata = (next, nextErr) => {
	// const { filter, firstLoad } = payload;

	return {
		type: SINGLE_API,
		payload: {
			uri: '/information_centres',
			beforeCallType: 'GET_METADATA_LIST_REQUEST',
			successType: 'GET_METADATA_LIST_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};

export const updateMetadataRequest = (payload = {}, next, nextErr) => {
	const { alias, params } = payload;
	return {
		type: SINGLE_API,
		payload: {
			opt: { method: 'PUT' },
			uri: `/information_centres/${alias}`,
			params,
			beforeCallType: 'UPDATE_METADATA_LIST_REQUEST',
			successType: 'UPDATE_METADATA_LIST_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};
