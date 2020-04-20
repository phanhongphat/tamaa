import { SINGLE_API } from '../actions/type';

export const resetPassword = (payload = {}, next, nextErr) => {
    return {
        type: SINGLE_API,
        payload: {
            opt: { method: 'POST' },
            params: { ...payload },
            uri: '/reset_password',
            beforeCallType: 'RESET_PASSWORD_REQUEST',
            successType: 'RESET_PASSWORD_SUCCESS',
            afterSuccess: next,
            afterError: nextErr
        }
    };
};
