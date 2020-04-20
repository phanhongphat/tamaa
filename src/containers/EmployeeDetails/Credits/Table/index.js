import React, { PureComponent, Fragment } from 'react';
import injectSheet from 'react-jss';
import { Table, Divider, Tag, DatePicker, Input, Button, Tabs, Icon } from 'antd';
const { TabPane } = Tabs;
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getEmployeeDetails, editEmployeeRequest } from 'src/redux/actions/employee';
const { RangePicker } = DatePicker;

import Highlighter from 'react-highlight-words';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import styles from './styles';
import moment from 'moment';
import CONSTANTS from '../../../../constants';

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
	textInput = () => {
		return <Input placeholder="Free text" />;
	};
	render() {
		// const { classes, data } = this.props;

		const column = [
			{
				title: 'ID',
				dataIndex: 'transactionId',
				key: 'transactionId',
				sorter: true,
				...this.getColumnSearchProps('transactionId')

				// ...this.getColumnSearchProps('id')
			},
			{
				title: 'Date',
				dataIndex: 'date',
				key: 'date',
				...this.getColumnSearchProps('date'),
				render: value => {
					return moment(value, 'YYYY-MM-DD[T]HH:mm:ss').format('DD-MM-YYYY HH:mm:ss');
				}
			},
			{
				title: 'Amount',
				dataIndex: 'amount',
				key: 'amount',
				align: 'right',
				render: value => numberWithSpaces(value) + ' ' + CONSTANTS.CURRENCY
			},
			{
				title: 'Expéditeur',
				dataIndex: 'sender',
				key: 'sender',
				...this.getColumnSearchProps('sender')
			},
			{
				title: 'Note 1',
				dataIndex: 'noteMain',
				key: 'noteMain'
				// ...this.getColumnSearchProps('creditAffect')
			},
			{
				title: 'Note 2',
				dataIndex: 'noteSub',
				key: 'noteSub'
			}
		];

		const { data } = this.props;
		console.log(data && data);
		return <Table style={{ cursor: 'pointer' }} columns={column} dataSource={data} />;
	}
}
