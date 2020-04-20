import React, { PureComponent } from 'react';
import { Table, Icon, Input, Button } from 'antd';
import { Router } from 'src/routes';
import Highlighter from 'react-highlight-words';
export default class SampleTable extends PureComponent {
	state = {
		selectedRowKeys: []
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
		const {
			company = false,
			email = false,
			comBalance = false,
			empBalance = false,
			employeeName = false,
			phone = false,
			data,
			filterData,
			url
		} = this.props;

		// console.log(filterData);

		const { selectedRowKeys } = this.state;
		const columns = [
			{
				title: 'ID',
				dataIndex: 'customId',
				key: 'id',
				...this.getColumnSearchProps('customId'),
				sorter: (a, b) => a.customId - b.customId
			},
			employeeName
				? {
						title: 'Employés',
						dataIndex: 'employeeName',
						key: 'employeeName'
						// filters: filterData,
						// onFilter: (value, record) => record.company.includes(value)
				  }
				: {},
			phone
				? {
						title: 'Numéro de teléphono',
						dataIndex: 'phoneNumber',
						key: 'phoneNumber',
						sorter: (a, b) => a.phoneNumber - b.phoneNumber,
						render: phoneNumber => `+${phoneNumber}`
				  }
				: {},
			email
				? {
						title: 'Email',
						dataIndex: 'email',
						key: 'email',
						...this.getColumnSearchProps('email')
				  }
				: {},
			company
				? {
						title: 'Société',
						dataIndex: 'company',
						key: 'company',
						filters: filterData,
						onFilter: (value, record) => record.company.includes(value)
				  }
				: {},

			comBalance
				? {
						title: 'Solde',
						dataIndex: 'balance',
						key: 'balance',
						sorter: (a, b) => a.balance - b.balance
				  }
				: {},
			empBalance
				? {
						title: 'Solde des epmloyés',
						dataIndex: 'employeeBalance',
						key: 'employeeBalance',
						sorter: (a, b) => a.employeeBalance - b.employeeBalance
				  }
				: {},
			{
				title: 'Status du comte',
				dataIndex: 'activated',
				key: 'activated',
				render: activated => {
					return !activated ? (
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
		// console.log(columns);
		return (
			<Table
				style={{ cursor: 'pointer' }}
				rowSelection={rowSelection}
				columns={columns.filter(value => Object.keys(value).length !== 0)}
				pagination={{ pageSize: 100 }}
				dataSource={data}
				onRow={e => ({
					onClick: () => {
						Router.pushRoute(`${url}${e.id}`);
					}
				})}
			/>
		);
	}
}
