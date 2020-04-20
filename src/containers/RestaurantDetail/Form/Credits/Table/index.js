import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import injectSheet from 'react-jss';
import { Table, Divider, Tag, Checkbox, Input, Button, Tabs, Icon } from 'antd';
const { TabPane } = Tabs;

import Highlighter from 'react-highlight-words';

import styles from './styles';
import CONSTANTS from 'src/constants';
import { FormattedMessage } from 'react-intl';

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
		// const { classes, data } = this.props;

		const column = [
			{
				title: <FormattedMessage id="restaurants.credits.table.id" defaultMessage="ID" />,
				dataIndex: 'transactionId',
				key: 'transactionId',
				sorter: true,
				...this.getColumnSearchProps('id')
			},
			{
				title: <FormattedMessage id="restaurants.credits.table.date" defaultMessage="Date" />,
				dataIndex: 'date',
				key: 'date',
				render: value => {
					return moment(value, 'YYYY-MM-DD[T]HH:mm:ss').format('DD-MM-YYYY HH:mm:ss');
				}
			},
			{
				title: <FormattedMessage id="restaurants.credits.table.amount" defaultMessage="Amount" />,
				dataIndex: 'amount',
				key: 'amount',
				align: 'right',
				render: value => numberWithSpaces(value) + ' ' + CONSTANTS.CURRENCY
				// ...this.getColumnSearchProps('amount')
			},
			{
				title: <FormattedMessage id="restaurants.credits.table.note1" defaultMessage="Note 1" />,
				dataIndex: 'noteMain',
				key: 'noteMain'
				// ...this.getColumnSearchProps('creditAffect')
			},
			{
				title: <FormattedMessage id="restaurants.credits.table.note2" defaultMessage="Note 2" />,
				dataIndex: 'noteSub',
				key: 'noteSub'
			}
		];
		return (
			// <div className={classes.main}>
			<Fragment>
				<Table
					// scroll={{x: true}}
					columns={column}
					dataSource={this.props.data}
				/>
			</Fragment>
			// </div>
		);
	}
}
