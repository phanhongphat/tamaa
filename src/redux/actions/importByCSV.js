import { SINGLE_API } from 'src/redux/actions/type';

export const importByCSV = (payload, next, nextErr) => {
    // const { filter, firstLoad } = payload;
    const { entity, files } = payload;
    console.log({
        uri: `/import/${entity}`,
        params: {
            files
        }
    });
    return {
        type: SINGLE_API,
        payload: {
            uri: `/import/${entity}`,
            params: { files },
            opt: {
                method: 'POST',
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            },
            uploadFile: true,
            beforeCallType: 'UPDATE_RESTAURANT_IMAGE_REQUEST',
            successType: 'UPDATE_RESTAURANT_IMAGE_SUCCESS',
            afterSuccess: next,
            afterError: nextErr
        }
    };
};
