import React, { PureComponent } from 'react';

import injectSheet from 'react-jss';
import { Col, Icon, Modal, Update, Upload } from 'antd';
import styles from './styles';
import { FormattedMessage } from 'react-intl';

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

@injectSheet(styles)
// @Form.create()
export default class UploadImages extends PureComponent {
    state = {
        loading: true,
        previewVisible: false,
        previewImage: '',
    };

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true
        });
    };

    render() {
        const { previewVisible, previewImage } = this.state;
        const { max, multiple = false, fileList, handleChange, onRemove } = this.props;

        const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">
                    <FormattedMessage
                        id="restaurants.create.upload"
                        defaultMessage="Upload"/>
                </div>
            </div>
        );

        return (
            <div>
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    multiple={multiple}
                    listType="picture-card"
                    fileList={fileList}
                    onRemove={onRemove}
                    onPreview={this.handlePreview}
                    onChange={handleChange}>
                    {fileList && fileList.length >= max ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    footer={null}
                    onCancel={this.handleCancel}>
                    <img
                        alt="example"
                        style={{ width: '100%' }}
                        src={previewImage}/>
                </Modal>
            </div>
        );
    }
}
