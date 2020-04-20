import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';

import { Table, Divider, Tag, Icon, Button, Progress, Modal, Typography } from 'antd';
import { FormattedMessage } from 'react-intl';

import injectSheet from 'react-jss';
import styles from './styles';
import ImportResultTable from 'src/components/Import/ImportResultModal/ImportResultTable';

const { Text, Title } = Typography;

@injectSheet(styles)
export default class ImportResultModal extends PureComponent {
    state = {};

    render() {
        const {
            classes,
            importTitle = "Import result",
            importResultVisible,
            importResult,
            handleCancel
        } = this.props;

        if (importResult && importResult.constructor === Array) {
            return (
                <Modal
                    title={importTitle}
                    visible={importResultVisible}
                    // confirmLoading={this.state.loading}
                    width="70%"
                    onCancel={handleCancel}
                    destroyOnClose
                    footer={[
                        <Button type="default" onClick={handleCancel}>
                            <FormattedMessage
                                id="restaurants.popupRefund.cancel"
                                defaultMessage="Cancel"/>
                        </Button>
                    ]}>
                    <div style={{ width: '30%' }}>
                        <h4>
                            <strong>
                                <FormattedMessage
                                    id="restaurants.importResultModal.importProgressing"
                                    defaultMessage="Import progressing"/>
                            </strong>
                            {importResultVisible && importResult[0].stage ? ': ' + importResult[0].stage : ''}
                        </h4>
                        <Progress
                            percent={importResult && importResult[0].stage === 'Import data' ? 100 : 30}
                            size="small"
                            type="line"
                            status={importResult && importResult[0].stage && importResult[0].stage === 'Import data' ? 'success' : 'exception'}
                            showInfo={false}/>
                    </div>
                    <ImportResultTable
                        data={importResult}
                        stage={importResult ? importResult[0].stage : ''}
                    />
                </Modal>
            );
        }
        else {
            return (
                <Modal
                    title={importTitle}
                    visible={importResultVisible}
                    // confirmLoading={this.state.loading}
                    // width="50%"
                    onCancel={handleCancel}
                    destroyOnClose
                    footer={[
                        <Button type="default" onClick={handleCancel}>
                            <FormattedMessage
                                id="restaurants.popupRefund.cancel"
                                defaultMessage="Cancel"/>
                        </Button>
                    ]}>
                    <Text type="danger">
                        <strong>
                            {importResult && importResult.message}
                        </strong>
                    </Text>
                </Modal>
            );
        }
    }
}
