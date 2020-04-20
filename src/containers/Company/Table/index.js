import React, { PureComponent } from 'react';
import Highlighter from 'react-highlight-words';

import { Table, Tag, Icon, Input, Button } from 'antd';
import CONSTANTS from 'src/constants';

import { Router } from 'src/routes';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

function numberWithSpaces(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export default class CompanyTable extends PureComponent {
	state = {
		selectedRowKeys: []
	};

	componentDidMount() {
		this.setState({ user: this.props.datas });
	}

	start = () => {
		setTimeout(() => {
			this.setState({
				selectedRowKeys: []
			});
		});
	};

	getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: '10px' }}>
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
		const { selectedRowKeys } = this.state;
		const dataSource = [];
		const columns = [
			{
				title: 'ID',
				dataIndex: 'customId',
				key: 'id',
				...this.getColumnSearchProps('customId'),
				sorter: (a, b) => a.customId > b.customId
			},
			{
				title: <FormattedMessage id="company" defaultMessage="Company" />,
				dataIndex: 'company',
				key: 'company',
				...this.getColumnSearchProps('company')
			},
			{
				title: 'Email',
				dataIndex: 'email',
				key: 'email',
				...this.getColumnSearchProps('email')
			},

			{
				title: <FormattedMessage id="employees.balance" defaultMessage="Current balance" />,
				dataIndex: 'currentBalance',
				key: 'currentBalane',
				align: 'right',
				sorter: (a, b) => a.balance > b.balance,
				render: balance => {
					return balance ? `${numberWithSpaces(balance)} ${CONSTANTS.CURRENCY}` : 0;
				}
			},
			{
				title: <FormattedMessage id="companies.employeesBalance" defaultMessage="Employees balance" />,
				dataIndex: 'employeesBalance',
				key: 'employeesBalance',
				align: 'right',
				sorter: (a, b) => a.employeesBalance > b.employeesBalance,
				render: employeesBalance => {
					return employeesBalance ? `${numberWithSpaces(employeesBalance)} ${CONSTANTS.CURRENCY}` : 0;
				}
			},
			{
				title: 'Statut du compte',
				key: 'status',
				dataIndex: 'user',
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
				this.props.setSelected(selectedRows);
				this.setState({
					selectedRowKeys
				});
			}
		};
		this.props.resetRow ? this.start() : null;

		if (this.props.datas.length > 0) {
			this.props.datas
				.sort((a, b) => b.id - a.id)
				.map((data, index) =>
					dataSource.push({
						key: index,
						id: data.id,
						customId: data.user ? data.user.customId : data.customId,
						email: data.email,
						company: data.name,
						currentBalance: data.balance,
						exployeeBalance: data.employeeBalance,
						userId: data.user ? data.user.id : data.userId,
						employeesBalance: data.employeesBalance ? data.employeesBalance : data.total,
						user: data.user
							? data.user
							: { activated: data.activated, creditActivated: data.creditActivated }
					})
				);
		} else null;

		return (
			<Table
				style={{ cursor: 'pointer' }}
				rowSelection={rowSelection}
				columns={columns}
				pagination={{ pageSize: 100 }}
				dataSource={dataSource}
				onRow={e => ({
					onClick: () => {
						Router.pushRoute(`/company-detail/${e.id}`);
					}
				})}
			/>
		);
	}
}
