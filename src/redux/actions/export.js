import { SINGLE_API } from 'src/redux/actions/type';

let temp = '';

export const exportCompany = (payload = {}, next, nextErr) => {
	let [id, uri] = payload;
	// let tempUri = uri;
	for (let i = 0; i < id.length; i++) {
		temp += `id[]=${id[i]}&`;
	}
	temp = temp.substring(0, temp.length - 1);
	uri += temp;

	return {
		type: SINGLE_API,
		payload: {
			// opt: { headers: { Accept: 'text/csv' } },
			uri,
			beforeCallType: 'EXPORT_COMPANY_REQUEST',
			successType: 'EXPORT_COMPANY_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
		}
	};
};
