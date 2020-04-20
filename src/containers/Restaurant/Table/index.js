import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import Highlighter from 'react-highlight-words';

import { Table, Divider, Tag, Icon, Spin, Row, Input, Button } from 'antd';
import { FormattedMessage } from 'react-intl';

import injectSheet from 'react-jss';
import styles from './styles';

import { Router } from 'src/routes';

function numberWithSpaces(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

@injectSheet(styles)
export default class TableRestaurant extends PureComponent {
	state = {
		selectedRowKeys: [],
		itemsSelectedDelete: []
	};

	handleSearch = (selectedKeys, confirm) => {
		confirm();
		this.setState({ searchText: selectedKeys[0] });
	};

	handleReset = clearFilters => {
		clearFilters();
		this.setState({ searchText: '' });
	};

	getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div>
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
				textToHighlight={text.toString()}
			/>
		)
	});

	render() {
		const { selectedRowKeys } = this.state;
		const { classes, data, selectedRows, setSelected } = this.props;
		const rowSelection = {
			selectedRowKeys,
			onChange: (selectedRowKeys, selectedRows) => {
				setSelected(selectedRows);
				this.setState({ selectedRowKeys });
				this.props.setListId(selectedRows);
			},

			getCheckboxProps: record => ({
				disabled: record.user.activated === false // Column configuration not to be checked
			})
		};
		const columns = [
			{
				title: <FormattedMessage id="restaurants.table.id" defaultMessage="ID" />,
				dataIndex: 'user.customId',
				key: 'id',
				...this.getColumnSearchProps('id'),
				sorter: (a, b) => a.user.customId > b.user.customId
			},
			{
				title: <FormattedMessage id="restaurants.table.restaurant" defaultMessage="Restaurant" />,
				dataIndex: 'restaurantName',
				key: 'restaurantName',
				...this.getColumnSearchProps('restaurantName'),
				sorter: (a, b) => a.restaurantName > b.restaurantName
			},
			{
				title: <FormattedMessage id="restaurants.table.email" defaultMessage="Email" />,
				dataIndex: 'email',
				key: 'email',
				...this.getColumnSearchProps('email'),
				sorter: (a, b) => a.email > b.email
				//render: (text, record) => <a href={'mailto:' + record.email}>{record.email}</a>
			},
			{
				title: <FormattedMessage id="restaurants.table.address" defaultMessage="Address" />,
				dataIndex: 'address',
				key: 'address',
				...this.getColumnSearchProps('address'),
				sorter: (a, b) => a.address > b.address
			},
			{
				title: <FormattedMessage id="restaurants.table.currentBalance" defaultMessage="Balance" />,
				dataIndex: 'balance',
				key: 'balance',
				align: 'right',
				render: value => (value ? numberWithSpaces(value) : 0),
				sorter: (a, b) => a.balance > b.balance
			},
			{
				title: <FormattedMessage id="restaurants.table.refundDate" defaultMessage="Refund date" />,
				dataIndex: 'refundDate',
				key: 'refundDate',
				sorter: (a, b) => a.refundDate > b.refundDate
				// render: value => moment(value).format('DD/MM/YYYY HH:mm:ss')
			},
			{
				title: <FormattedMessage id="restaurants.table.accountStatus" defaultMessage="Account activated" />,
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
		return (
			// <div className={classes.main}>
			<Table
				rowSelection={rowSelection}
				columns={columns}
				// scroll={{ x: true }}
				dataSource={data}
				rowKey="id"
				pagination={{ pageSize: 50 }}
				onRow={e => ({
					onClick: () => {
						Router.pushRoute(`/restaurants-detail/${e.id}`);
					}
				})}
			/>
			// </div>
		);
	}
}
