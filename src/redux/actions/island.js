import { SINGLE_API } from './type';

export const getListIsland = (next, nextErr, payload = {}) => {
    return {
        type: SINGLE_API,
        payload: {
            uri: '/islands',
            params: payload,
			beforeCallType: 'GET_LIST_ISLAND_REQUEST',
			successType: 'GET_LIST_ISLAND_SUCCESS',
			afterSuccess: next,
			afterError: nextErr
        }
    };
};

export const getIslandDetails = (id, next, nextErr) => {
    return {
        type: SINGLE_API,
        payload: {
            uri: `/islands/${id}`,
            beforeCallType: 'GET_ISLAND_DETAILS_REQUEST',
            successType: 'GET_ISLAND_DETAILS_SUCCESS',
            afterSuccess: next,
            afterError: nextErr
        }
    };
};

export const createIslandRequest = (payload = {}, next, nextErr) => {
    return {
        type: SINGLE_API,
        payload: {
            opt: { method: 'POST' },
            uri: '/islands',
            params: { ...payload },
            beforeCallType: 'CREATE_ISLAND_REQUEST',
            successType: 'CREATE_ISLAND_SUCCESS',
            afterSuccess: next,
            afterError: nextErr
        }
    };
};

export const updateIslandRequest = (payload = {}, next, nextErr) => {
    return {
        type: SINGLE_API,
        payload: {
            opt: { method: 'PUT' },
            uri: `/islands/${payload.id}`,
            params: { ...payload },
            beforeCallType: 'UPDATE_ISLAND_REQUEST',
            successType: 'UPDATE_ISLAND_SUCCESS',
            afterSuccess: next,
            afterError: nextErr
        }
    };
};
