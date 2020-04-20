import { SINGLE_API } from 'src/redux/actions/type';

export const uploadRestaurantImages = (payload, next, nextErr) => {
    // const { filter, firstLoad } = payload;
    const { id, files } = payload;
    console.log({
        uri: `/user/${id}/upload/photo`,
        params: {
            files
        }
    });
    return {
        type: SINGLE_API,
        payload: {
            uri: `/user/${id}/upload/photo`,
            params: { files },
            opt: {
                method: 'POST',
                headers: {
                    "Content-Type": "multipart/form-data; boundary=--------------------------009448961678259043789516"
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
