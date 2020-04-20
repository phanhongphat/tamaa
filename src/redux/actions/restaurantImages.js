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

export const deleteRestaurantImages = (payload, next, nextErr) => {
    // const { filter, firstLoad } = payload;
    const { id, file_id } = payload;
    console.log({
        uri: `/user/${id}/delete/photo`,
        params: {
            file_id
        }
    });
    return {
        type: SINGLE_API,
        payload: {
            uri: `/user/${id}/delete/photo`,
            params: { file_id },
            opt: {
                method: 'DELETE',
            },
            uploadFile: true,
            beforeCallType: 'DELETE_RESTAURANT_IMAGE_REQUEST',
            successType: 'DELETE_RESTAURANT_IMAGE_SUCCESS',
            afterSuccess: next,
            afterError: nextErr
        }
    };
};
