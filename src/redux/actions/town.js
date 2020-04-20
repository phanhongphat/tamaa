import { SINGLE_API } from './type';

export const getListTowns = (next, nextErr, payload = {}) => {
    return {
        type: SINGLE_API,
        payload: {
            uri: '/cities',
            params: payload,
			beforeCallType: 'GET_LIST_TOWNS_REQUEST',
			successType: 'GET_LIST_TOWNS_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
        }
    };
};

export const createTownsRequest = (payload = {}, next, nextErr) => {
    return {
        type: SINGLE_API,
        payload: {
            opt: { method: 'POST' },
            uri: '/cities',
            params: { ...payload },
            beforeCallType: 'CREATE_TOWN_REQUEST',
            successType: 'CREATE_TOWN_SUCCESS',
            afterSuccess: next,
            afterError: nextErr
        }
    };
};

export const updateTownsRequest = (payload = {}, next, nextErr) => {
    return {
        type: SINGLE_API,
        payload: {
            opt: { method: 'PUT' },
            uri: `/cities/${payload.id}`,
            params: { ...payload },
            beforeCallType: 'UPDATE_TOWN_REQUEST',
            successType: 'UPDATE_TOWN_SUCCESS',
            afterSuccess: next,
            afterError: nextErr
        }
    };
};
