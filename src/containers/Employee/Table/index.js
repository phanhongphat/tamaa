import React, { PureComponent, Fragment } from 'react';
import injectSheet from 'react-jss';
import { Table, Divider, Tag, Checkbox, Icon } from 'antd';
// import FilterResults from 'react-filter-search';
import { Router } from 'src/routes';
import styles from './styles';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import moment from 'moment';
// rowSelection object indicates the need for row selection
function numberWithSpaces(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function PhoneWithSpaces(x) {
	return x.toString().replace(/^(.{3})(.{2})(.{3})(.*)$/, '$1 $2 $3 $4');
}

@injectSheet(styles)
export default class TableEmployee extends PureComponent {
	state = {
		sortedInfo: null,
		selectedRowKeys: [],
		itemsSelectedDelete: []
	};

	// handleChange = (pagination, filters, sorter) => {
	// 	console.log('Various parameters', pagination, filters, sorter);
	// 	this.setState({
	// 		sortedInfo: sorter
	// 	});
	// };

	clearFilters = () => {
		this.setState({ filteredInfo: null });
	};

	clearAll = () => {
		this.setState({
			filteredInfo: null,
			sortedInfo: null
		});
	};

	setAgeSort = () => {
		this.setState({
			sortedInfo: {
				order: 'descend',
				columnKey: 'age'
			}
		});
	};

	onSelectChange = (selectedRowKeys, selectedRows) => {
		// console.log('selectedRowKeys ===>', selectedRowKeys);
		// console.log('selectedRows ===>', selectedRows);
		this.props.setListId(selectedRows);
		this.setState({ selectedRowKeys });
	};

	render() {
		const { sortedInfo, selectedRowKeys } = this.state;
		// sortedInfo = sortedInfo || {};

		const { classes, data } = this.props;
		const datas = [];
		const tempDatas = data.forEach((item, index) => {
			const n = item;
			n['full'] = item.firstName ? item.firstName + ' ' + item.lastName : '';
			if (this.props.isSearch === false) {
				let customId = '';
				n['companyName'] = item.company ? item.company.name : '';

				if (item.user !== null || item.user !== undefined || item.user !== '') {
					customId = item.user ? item.user.customId : '';
					n['customId'] = customId;
				}
			}

			datas.push(n);
		});
		// };
		let column = [
			{
				title: 'ID',
				dataIndex: 'customId',
				key: 'customId',
				sorter: (a, b) => a.id - b.id
			},
			{
				title: <FormattedMessage id="employees.name" defaultMessage="Employee" />,
				dataIndex: 'full'
			},
			{
				title: <FormattedMessage id="employees.companyName" defaultMessage="Company Name" />,
				dataIndex: 'companyName',
				filters: this.props.companies,
				onFilter: (value, record) => record.companyName && record.companyName.indexOf(value) === 0
				// sortOrder: sortedInfo.columnKey === 'full' && sortedInfo.order
			},
			{
				title: 'Email',
				dataIndex: 'email',
				key: 'email'
			},
			{
				title: <FormattedMessage id="employees.phoneNumber" defaultMessage="Phone Number" />,
				dataIndex: 'phoneNumber',
				key: 'phoneNumber',
				render: phoneNumber => PhoneWithSpaces(phoneNumber)
			},
			{
				title: <FormattedMessage id="employees.balance" defaultMessage="Balance" />,
				dataIndex: 'balance',
				key: 'balance',
				align: 'right',
				sorter: (a, b) => a.balance - b.balance,
				render: balance => {
					return balance ? numberWithSpaces(balance) : 0;
				}
			},
			{
				title: 'Last Transaction',
				dataIndex: 'lastTransaction',
				key: 'lastTransaction',
				sorter: (a, b) => a.balance - b.balance,
				render: value => (value ? moment(value).format('DD/MM/YYYY HH:mm Z') : '')
			},
			{
				title: <FormattedMessage id="accountActivate" defaultMessage="Activated Account" />,
				dataIndex: 'user',
				key: 'user',
				align: 'center',
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
			selectedRowKeys,
			onChange: this.onSelectChange
		};

		// console.log(this.props.data);
		return (
			<Fragment>
				<Table
					style={{ cursor: 'pointer' }}
					rowSelection={rowSelection}
					columns={column}
					dataSource={datas}
					pagination={{ pageSize: 100 }}
					// scroll={{ x: true }}
					// onChange={this.handleChange}
					onRow={e => ({
						onClick: () => {
							Router.pushRoute(`/employee-details/${e.id}`);
						}
					})}
					rowKey="id"
				/>
			</Fragment>
		);
	}
}
