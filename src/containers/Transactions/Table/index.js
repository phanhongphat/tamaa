import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Table, Input, Button, Icon } from 'antd';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import moment from 'moment';
import CONSTANTS from '../../../constants';

function numberWithSpaces(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export default class TransactionTable extends PureComponent {
	state = {
		searchText: ''
	};

	getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={node => {
						this.searchInput = node;
					}}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Button
					type="primary"
					onClick={() => this.handleSearch(selectedKeys, confirm)}
					icon="search"
					size="small"
					style={{ width: 90, marginRight: 8 }}>
					Search
				</Button>
				<Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
					Reset
				</Button>
			</div>
		),
		filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />,
		onFilter: (value, record) =>
			record[dataIndex]
				.toString()
				.toLowerCase()
				.includes(value.toLowerCase()),
		onFilterDropdownVisibleChange: visible => {
			if (visible) {
				setTimeout(() => this.searchInput.select());
			}
		},
		render: text => (
			<Highlighter
				highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
				searchWords={[this.state.searchText]}
				autoEscape
				textToHighlight={text ? text.toString() : ''}
			/>
		)
	});

	handleSearch = (selectedKeys, confirm) => {
		confirm();
		this.setState({ searchText: selectedKeys[0] });
	};

	handleReset = clearFilters => {
		clearFilters();
		this.setState({ searchText: '' });
	};

	render() {
		const { data } = this.props;
		let datas = [];
		const tempDatas =
			data &&
			data.forEach((item, index) => {
				// const n = item;
				let obj = {
					...item
				};
				const firstNameSender = (item.debitor && item.debitor.firstName) || '';
				const lastNameSender = (item.debitor && item.debitor.lastName) || '';
				const firstNameReceiver = (item.creditor && item.creditor.firstName) || '';
				const lastNameReceiver = (item.creditor && item.creditor.lastName) || '';
				// n['Sender'] =
				// 	item.debitor.firstName !== null
				// 		? item.debitor.firstName
				// 		: '' + ' ' + item.debitor.lastName !== null || undefined
				// 		? item.debitor.lastName
				// 		: '';
				// n['Receiver'] =
				// 	item.creditor.firstName !== null || undefined
				// 		? item.creditor.firstName
				// 		: '' + ' ' + item.creditor.lastName !== null || undefined
				// 		? item.creditor.lastName
				// 		: '';
				obj.Sender = firstNameSender + ' ' + lastNameSender;
				obj.Receiver = firstNameReceiver + ' ' + lastNameReceiver;
				datas.push(obj);
			});
		// console.log(data);
		// console.log('datas ==>', datas);
		const columns = [
			{
				title: 'ID',
				dataIndex: 'transactionId',
				key: 'id',
				sorter: (a, b) => a.id > b.id,
				sortDirections: ['descend', 'ascend']
			},
			// {
			// 	title: <FormattedMessage id="employees.name" defaultMessage="Employee" />,
			// 	dataIndex: 'Sender',
			// 	key: 'Sender',
			// 	...this.getColumnSearchProps('Sender')
			// },
			// {
			// 	title: <FormattedMessage id="restaurant" defaultMessage="Restaurant" />,
			// 	dataIndex: 'creditor.email',
			// 	key: 'creditor.email'
			// },
			{
				title: <FormattedMessage id="debitor" defaultMessage="Employee" />,
				dataIndex: 'Sender',
				key: 'Sender'
			},
			{
				title: <FormattedMessage id="creditor" defaultMessage="Restaurant" />,
				dataIndex: 'Receiver',
				key: 'Receiver'
			},
			{
				title: 'Date',
				dataIndex: 'date',
				key: 'date',
				// ...this.getColumnSearchProps('date'),
				render: value => {
					return moment(value, 'YYYY-MM-DD[T]HH:mm:ss').format('DD-MM-YYYY HH:mm:ss');
				}
			},
			// {
			// 	title: 'Date',
			// 	dataIndex: 'date',
			// 	key: 'date'
			// },
			{
				title: <FormattedMessage id="amount" defaultMessage="Amount" />,
				dataIndex: 'amount',
				key: 'amount',
				align: 'right',
				render: amount => numberWithSpaces(amount) + ' ' + CONSTANTS.CURRENCY
			}
			// {
			// 	title: 'Note 1',
			// 	dataIndex: 'noteMain',
			// 	key: 'noteMain'
			// },
			// {
			// 	title: 'Note 2',
			// 	dataIndex: 'noteSub',
			// 	key: 'noteSub'
			// }
		];

		return (
			<Table
				style={{ cursor: 'pointer' }}
				pagination={{ pageSize: 50 }}
				// scroll={{ x: true }}
				dataSource={datas.sort((a, b) => b.id - a.id)}
				columns={columns}
			/>
		);
	}
}
