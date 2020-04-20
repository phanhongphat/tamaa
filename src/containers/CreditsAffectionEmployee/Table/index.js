import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import { Table, Typography, Tag, Input, Button, Icon } from 'antd';
import Highlighter from 'react-highlight-words';
import styles from './styles';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

const { Text } = Typography;

function numberWithSpaces(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

@injectSheet(styles)
export default class TableEmployee extends PureComponent {
	state = {
		selectedRowKeys: []
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

	onSelectChange = (selectedRowKeys, selectedRows) => {
		console.log('selectedRowKeys ===>', selectedRowKeys);
		console.log('selectedRows ===>', selectedRows);
		this.props.setListId(selectedRows);
		this.setState({ selectedRowKeys });
	};

	render() {
		const { classes, selectedRows, setSelected } = this.props;
		const { sortedInfo, selectedRowKeys } = this.state;
		const { data } = this.props;
		const datas = [];
		const tempDatas = data.forEach((item, index) => {
			const n = item;
			n['full'] = item.firstName + ' ' + item.lastName;
			datas.push(n);
		});
		let column = [
			{
				title: 'ID',
				dataIndex: 'user.customId',
				key: 'id',
				sorter: (a, b) => a.id - b.id
			},
			{
				title: <FormattedMessage id="employees.name" defaultMessage="Employee" />,
				dataIndex: 'full',
				// /render: (firstName, lastName) => `${firstName} ${lastName}`,
				key: 'full',
				sorter: (a, b) => a.full.localeCompare(b.full),
				...this.getColumnSearchProps('full')
				// sortOrder: sortedInfo.columnKey === 'full' && sortedInfo.order
			},
			{
				title: <FormattedMessage id="employees.phoneNumber" defaultMessage="Phone Number" />,
				dataIndex: 'phoneNumber',
				key: 'phoneNumber',
				...this.getColumnSearchProps('phoneNumber'),
				sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber)
			},
			{
				title: 'Email',
				dataIndex: 'email',
				key: 'email',
				...this.getColumnSearchProps('email'),
				sorter: (a, b) => a.email.localeCompare(b.email)
			},
			{
				title: <FormattedMessage id="employees.balance" defaultMessage="Balance" />,
				dataIndex: 'balance',
				key: 'balance',
				align: 'right',
				sorter: (a, b) => a.balance - b.balance,
				//...this.getColumnSearchProps('balance'),
				render: balance => {
					return balance ? numberWithSpaces(balance) : 0;
				}
			},
			// {
			// 	title: <FormattedMessage id="employees.lastTransaction" defaultMessage="Last Transaction" />,
			// 	dataIndex: 'affectedDate',
			// 	key: 'affectedDate',
			// 	sorter: (a, b) => a.affectedDate.localeCompare(b.affectedDate)
			// },
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
			// {
			// 	title: <FormattedMessage id="creditActivate" defaultMessage="Activated Credit" />,
			// 	dataIndex: 'user',
			// 	key: 'user',
			// 	align: 'center',
			// 	render: user => {
			// 		return !user.creditActivated ? (
			// 			<Icon type="close-circle" theme="twoTone" twoToneColor="#FF0000" />
			// 		) : (
			// 			<Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
			// 		);
			// 	}
			// }
		];

		// const rowSelection = {
		// 	selectedRows,
		// 	onChange: (selectedRowKeys, selectedRows) => {
		// 		console.log(`selected ${selectedRowKeys.length} row(s):`, selectedRows);
		// 		setSelected(selectedRows);
		// 		this.setState({ selectedRowKeys });
		// 	}
		// };
		const rowSelection = {
			selectedRowKeys,
			onChange: this.onSelectChange
		};

		return (
			// <div>
			// 	{this.state.selectedRowKeys.length !== 0 ? (
			// 		<Text type="secondary" className={classes.totalSelected}>
			// 			{this.state.selectedRowKeys.length}
			// 			{this.state.selectedRowKeys.length > 1 ? (
			// 				<FormattedMessage id="itemsSelected" defaultMessage=" items selected" />
			// 			) : (
			// 				<FormattedMessage id="itemSelected" defaultMessage=" item selected" />
			// 			)}
			// 		</Text>
			// 	) : (
			// 		<div />
			// 	)}
			// 	<Table rowKey="id" rowSelection={rowSelection} columns={column} dataSource={this.props.data} />
			// </div>

			<Table
				style={{ cursor: 'pointer' }}
				rowKey="id"
				pagination={{ pageSize: 50 }}
				rowSelection={rowSelection}
				columns={column}
				// scroll={{ x: true }}
				dataSource={datas}
			/>
		);
	}
}
