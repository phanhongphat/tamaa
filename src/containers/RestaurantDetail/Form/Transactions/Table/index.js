import React, { PureComponent, Fragment } from 'react';
import injectSheet from 'react-jss';
import { Table, Divider, Tag, Checkbox, Input, Button, Tabs, Icon } from 'antd';
const { TabPane } = Tabs;

import Highlighter from 'react-highlight-words';

import styles from './styles';
import CONSTANTS from 'src/constants';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import moment from 'moment';

function numberWithSpaces(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

@injectSheet(styles)
export default class TableEmployee extends PureComponent {
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
					placeholder={`Chercher ${dataIndex}`}
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
					<FormattedMessage id="search" defaultMessage="Search" />
				</Button>
				<Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
					<FormattedMessage id="reset" defaultMessage="Reset" />
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
		render: text =>
			text && (
				<Highlighter
					highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
					searchWords={[this.state.searchText]}
					autoEscape
					textToHighlight={text.toString()}
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
		let dataTransactions = [...data];
		dataTransactions.map(item => {
			item['restaurantName'] = item.creditorInfo.restaurantName && item.creditorInfo.restaurantName;
		});

		const column = [
			{
				title: 'ID',
				dataIndex: 'transactionId',
				key: 'transactionId',
				sorter: true,
				...this.getColumnSearchProps('id')

				// ...this.getColumnSearchProps('id')
			},
			{
				title: 'Employee',
				// dataIndex: 'employeeName',
				key: 'employeeName',
				sorter: true,
				...this.getColumnSearchProps('restaurantName'),
				render: data =>  {
				    let firstName = data.debitor.firstName ? data.debitor.firstName : '';
				    let lastName = data.debitor.lastName ? data.debitor.lastName : '';
					return firstName + ' ' + lastName;
				}
				// ...this.getColumnSearchProps('id')
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
			{
				title: <FormattedMessage id="amount" defaultMessage="Amount" />,
				dataIndex: 'amount',
				key: 'amount',
				align: 'right',
				...this.getColumnSearchProps('amount'),
				render: amount => numberWithSpaces(amount) + ' ' + CONSTANTS.CURRENCY
			}
			// {
			// 	title: 'Note 1',
			// 	dataIndex: 'noteMain',
			// 	key: 'noteMain'
			// 	// ...this.getColumnSearchProps('creditAffect')
			// },
			// {
			// 	title: 'Note 2',
			// 	dataIndex: 'noteSub',
			// 	key: 'noteSub'
			// }
		];
		// console.log(this.props.data);
		return (
			// <div className={classes.main}>
			<Fragment>
				<Table
					// scroll={{ x: true }}
					pagination={{ pageSize: 50 }}
					columns={column}
					dataSource={this.props.data}
				/>
			</Fragment>
			// </div>
		);
	}
}
