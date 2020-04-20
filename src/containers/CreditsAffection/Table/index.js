import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import { Table, Typography, Tag, Icon } from 'antd';
import { Router } from 'src/routes';
import styles from './styles';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

const { Text } = Typography;

// const data = [
//     {
//         id: 123456,
//         email: "kd@gmail.com",
//         company: "Kyanon Digital",
//         balances: 100000
//     },
//     {
//         id: 230697,
//         email: "abc@gmail.com",
//         company: "ABC",
//         balances: 0
//     },
//     {
//         id: 280289,
//         email: "ynap@gmail.com",
//         company: "Ynapmoc",
//         balances: 2000
//     }
// ];

function numberWithSpaces(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

@injectSheet(styles)
export default class TableAffectCompanies extends PureComponent {
	state = {
		selectedRowKeys: []
	};

	render() {
		const { classes, selectedRows, setSelected, data, selectedRowKeys } = this.props;
		console.log(data);
		let columns = [
			{
				title: 'ID',
				dataIndex: 'user.customId',
				key: 'id',
				sorter: (a, b) => a.id - b.id
			},
			{
				title: <FormattedMessage id="company" defaultMessage="Company" />,
				dataIndex: 'name',
				key: 'name',
				sorter: (a, b) => a.name.localeCompare(b.name)
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
					return numberWithSpaces(balance);
				}
			},
			// {
			// 	title: <FormattedMessage id="companies.creditStatus" defaultMessage="Status Credits" />,
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
				title: <FormattedMessage id="companies.accountStatus" defaultMessage="Status Account" />,
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
				console.log(`selected ${selectedRowKeys} row(s):`, selectedRows);
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
				<Table
					style={{ cursor: 'pointer' }}
					rowSelection={rowSelection}
					columns={columns}
					pagination={{ pageSize: 50 }}
					dataSource={data}
					rowKey="id"
					onRow={e => ({
						onClick: () => {
							Router.pushRoute(`/credits-affection-employee/${e.id}`);
						}
					})}
				/>
			</div>
		);
	}
}
