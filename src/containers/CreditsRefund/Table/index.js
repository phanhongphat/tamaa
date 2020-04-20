import React, { PureComponent, Fragment } from 'react';
import injectSheet from 'react-jss';
import { Table, Typography, Tag, Icon } from 'antd';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import styles from './styles';

const { Text } = Typography;

function numberWithSpaces(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

@injectSheet(styles)
export default class TableRefundRestaurant extends PureComponent {
	state = {
		selectedRowKeys: []
	};

	render() {
		const { classes, selectedRows, setSelected, data } = this.props;
		console.log(data);
		const columns = [
			{
				title: 'ID',
				dataIndex: 'user.customId',
				key: 'id',
				sorter: (a, b) => a.id - b.id
			},
			{
				title: <FormattedMessage id="nav.restaurants" defaultMessage="Restaurant" />,
				dataIndex: 'restaurantName',
				key: 'restaurantName',
				sorter: (a, b) => a.restaurantName.localeCompare(b.restaurantName)
			},
			{
				title: 'Email',
				dataIndex: 'email',
				key: 'email',
				sorter: (a, b) => a.email.localeCompare(b.email)
			},
			{
				title: <FormattedMessage id="employees.balance" defaultMessage="Current balance" />,
				dataIndex: 'balance',
				key: 'balance',
				align: 'right',
				sorter: (a, b) => a.balance - b.balance,
				render: balance => {
					return balance ? numberWithSpaces(balance) : 0;
				}
			},
			// {
			// 	title: <FormattedMessage id="employees.creditactivated" defaultMessage="Status Credit" />,
			// 	dataIndex: 'user',
			// 	key: 'a',
			// 	align: 'center',
			// 	sorter: (a, b) => a.balance - b.balance,
			// 	render: user => {
			// 		return !user.creditActivated ? (
			// 			<Icon type="close-circle" theme="twoTone" twoToneColor="#FF0000" />
			// 		) : (
			// 			<Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
			// 		);
			// 	}
			// },
			{
				title: <FormattedMessage id="employees.activate" defaultMessage="Status Account" />,
				dataIndex: 'user',
				key: 'a',
				align: 'center',
				sorter: (a, b) => a.balance - b.balance,
				render: user => {
					return !user.activated ? (
						<Icon type="close-circle" theme="twoTone" twoToneColor="#FF0000" />
					) : (
						<Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
					);
				}
			}
		];

		const rowSelection = {
			selectedRows,
			onChange: (selectedRowKeys, selectedRows) => {
				console.log(`selected ${selectedRowKeys.length} row(s):`, selectedRows);
				setSelected(selectedRows);
				this.setState({ selectedRowKeys });
			}
		};

		return (
			<div>
				{this.state.selectedRowKeys.length !== 0 ? (
					<Text type="secondary" className={classes.totalSelected}>
						{this.state.selectedRowKeys.length}
						{this.state.selectedRowKeys.length > 1 ? (
							<FormattedMessage id="itemsSelected" defaultMessage=" items selected" />
						) : (
							<FormattedMessage id="itemSelected" defaultMessage=" item selected" />
						)}
					</Text>
				) : (
					<div />
				)}
				<Table rowSelection={rowSelection} pagination={{ pageSize: 50 }} columns={columns} rowKey="id" dataSource={data} />
			</div>
		);
	}
}
