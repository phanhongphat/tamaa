import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';

import { Table, Divider, Tag, Icon, Typography } from 'antd';
import { FormattedMessage } from 'react-intl';

import injectSheet from 'react-jss';
import styles from './styles';

import { Router } from 'src/routes';

const { Text } = Typography;
const columns = [
    {
        title: <FormattedMessage id="restaurants.importResultTable.email" defaultMessage="Email" />,
        dataIndex: 'email',
        key: 'email',
        width: '35%',
        //render: (text, record) => <a href={'mailto:' + record.email}>{record.email}</a>
    },
    {
        title: <FormattedMessage id="restaurants.importResultTable.row" defaultMessage="Row" />,
        dataIndex: 'line',
        key: 'row',
        align: 'center',
        width: '5%',
        render: (line, record) => line !== undefined ? line + 2 : ''
    },
    {
        title: <FormattedMessage id="restaurants.importResultTable.status" defaultMessage="Statut" />,
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: '10%',
        render: (status, record) => {
            console.log('status status status ', status);
            return status !== 'success' ? (
                <Icon type="close-circle" theme="twoTone" twoToneColor="#FF0000" />
            ) : (
                <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
            );
        }
    },
    {
        title: <FormattedMessage id="restaurants.importResultTable.message" defaultMessage="Message" />,
        dataIndex: 'message',
        key: 'message',
        render: (message, record) => message && message.constructor === Array ? message.toString() : message
    },
];

@injectSheet(styles)
export default class TableRestaurant extends PureComponent {
    state = {
        itemsSelectedDelete: []
    };

    render() {
        const { classes, data, stage } = this.props;

        return (
            <Table
                columns={columns}
                dataSource={data}
                rowKey="id"
                pagination={false}
            />
        );
    }
}
