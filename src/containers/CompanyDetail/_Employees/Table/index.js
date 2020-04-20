import React, { PureComponent } from 'react';
import Highlighter from 'react-highlight-words';

import { Table, Tag, Input, Button, Icon } from 'antd';

import { Router } from 'src/routes';
import CONSTANTS from 'src/constants';

import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

function numberWithSpaces(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export default class EmployeeTable extends PureComponent {
	state = {
		searchText: '',
		selectedRowKeys: []
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

	handleSearch = (selectedKeys, confirm) => {
		confirm();
		this.setState({ searchText: selectedKeys[0] });
	};

	handleReset = clearFilters => {
		clearFilters();
		this.setState({ searchText: '' });
	};

	start = () => {
		setTimeout(() => {
			this.setState({
				selectedRowKeys: []
			});
		});
	};

	render() {
		const { data } = this.props;
		const { selectedRowKeys } = this.state;
		const dataSource = [];

		this.props.resetRow ? this.start() : null;

		if (data.length > 0) {
			data.map((d, index) =>
				dataSource.push({
					key: index,
					id: d.id,
					customId: d.user.customId,
					email: d.email,
					employee: `${d.firstName} ${d.lastName}`,
					balance: d.balance,
					phoneNumber: d.phoneNumber,
					user: d.user
				})
			);
		}
		const columns = [
			{
				title: 'ID',
				dataIndex: 'customId',
				key: 'id',
				...this.getColumnSearchProps('customId'),
				sorter: (a, b) => a.customId > b.customId
			},
			{
				title: <FormattedMessage id="employees.name" defaultMessage="Employee" />,
				dataIndex: 'employee',
				key: 'employee',
				...this.getColumnSearchProps('employee'),
				sorter: (a, b) => a.employee > b.employee
			},
			{
				title: <FormattedMessage id="employees.phoneNumber" defaultMessage="Phone Number" />,
				dataIndex: 'phoneNumber',
				key: 'phoneNumber',
				...this.getColumnSearchProps('phoneNumber'),
				sorter: (a, b) => a.phoneNumber > b.phoneNumber
			},
			{
				title: 'Email',
				dataIndex: 'email',
				key: 'email',
				...this.getColumnSearchProps('email'),
				sorter: (a, b) => a.email > b.email
			},
			{
				title: <FormattedMessage id="employees.balance" defaultMessage="Balance" />,
				dataIndex: 'balance',
				key: 'balance',
				align: 'right',
				render: balance => {
					return balance ? `${numberWithSpaces(balance)} ${CONSTANTS.CURRENCY}` : 0;
				}
			},
			{
				title: <FormattedMessage id="employees.lastTransaction" defaultMessage="Last Transaction" />,
				dataIndex: 'lastTransaction',
				key: 'lastTransaction'
			},
			{
				title: <FormattedMessage id="accountActivate" defaultMessage="Activated Account" />,
				dataIndex: 'user',
				key: 'user',
				align: 'center',
				render: user => {
					return user && !user.activated ? (
						<Icon type="close-circle" theme="twoTone" twoToneColor="#FF0000" />
					) : (
						<Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
					);
				}
			}
		];
		const rowSelection = {
			selectedRowKeys,
			onChange: (selectedRowKeys, selectedRows) => {
				this.setState({
					selectedRowKeys
				});
				this.props.setSelected(selectedRows);
			}
		};

		return (
			<Table
				pagination={{ pageSize: 100 }}
				rowSelection={rowSelection}
				columns={columns}
				// scroll={{ x: true }}
				dataSource={dataSource}
				onRow={e => ({
					onClick: () => {
						Router.pushRoute(`/employee-details/${e.id}`);
					}
				})}
			/>
		);
	}
}
