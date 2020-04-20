import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';

import {
    Table,
    Divider,
    Tag,
    Icon,
    Button,
    Progress,
    Modal,
    message,
    Upload
} from 'antd';
import { FormattedMessage } from 'react-intl';

import injectSheet from 'react-jss';
import styles from './styles';
import ImportResultModal from 'src/components/Import/ImportResultModal';

const { Dragger } = Upload;

@injectSheet(styles)
export default class ImportModal extends PureComponent {
    state = {
    };

    render() {

        const {
            classes,
            importVisible,
            handleImport,
            loading,
            handleCancel,
            fileList,
            uploadText = 'Click or drag file to this area to upload',
            hintText = 'Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files'
        } = this.props;

        return (
            <Modal
                title="Import restaurants"
                visible={importVisible}
                onOk={handleImport}
                okText="Import"
                confirmLoading={loading}
                onCancel={handleCancel}
                cancelText="Cancel">
                <Dragger
                    name='file'
                    // multiple={true}
                    fileList={fileList}
                    action='https://www.mocky.io/v2/5cc8019d300000980a055e76'
                    beforeUpload={(file, FileList) => {
                        const isCSV = !!file.name.match(/\.csv$/); // && file.type === 'text/csv';
                        if (!isCSV) {
                            message.error('You can only upload CSV file!');
                        }
                        const isLt2M = file.size / 1024 / 1024 < 10;
                        if (!isLt2M) {
                            message.error('File must smaller than 10MB!');
                        }
                        return isCSV && isLt2M;
                    }}
                    onChange={(info) => {
                        const { status } = info.file;

                        if (status === 'done') {
                            message.success(`${info.file.name} file uploaded successfully.`);
                        } else if (status === 'error') {
                            message.error(`${info.file.name} file upload failed.`);
                        }

                        let fileList = [...info.fileList];

                        fileList = fileList.filter(
                            file => !!file.name.match(/\.csv$/) && file.size / 1024 / 1024 < 10
                        );

                        if (fileList.length > 1) {
                            fileList = fileList.slice(-1);
                        }

                        this.setState({ fileList });
                    }}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox"/>
                    </p>
                    <p className="ant-upload-text">
                        {uploadText}
                    </p>
                    <p className="ant-upload-hint">
                        {hintText}
                    </p>
                </Dragger>
            </Modal>
        );
    }
}
