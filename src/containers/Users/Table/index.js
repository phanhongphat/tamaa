import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import { Table, Tag, Input, Icon, Button } from 'antd';
import Highlighter from 'react-highlight-words';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

import { Router } from 'src/routes';

import styles from '../styles';

@injectSheet(styles)
export default class TableEmployee extends PureComponent {
	state = {
		loading: false,
		selectedRowKeys: [],
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
		render: text => {
			return (
				<Highlighter
					highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
					searchWords={[this.state.searchText]}
					autoEscape
					textToHighlight={text && text.toString()}
				/>
			);
		}
	});

	handleSearch = (selectedKeys, confirm) => {
		confirm();
		this.setState({ searchText: selectedKeys[0] });
	};

	handleReset = clearFilters => {
		clearFilters();
		this.setState({ searchText: '' });
	};

	onSelectChange = (selectedRows, selectedRowKeys) => {
		this.props.onSelectChange(selectedRows);
		console.log('selectedRows', selectedRows);
		this.setState({ selectedRows });
	};

	render() {
		const { loading, selectedRows } = this.state;
		const { classes, data } = this.props;

		const rowSelection = {
			selectedRows,
			onChange: (selectedRowKeys, selectedRows) => {
				this.onSelectChange(selectedRows);
			}
		};

		const columns = [
			{
				title: 'ID',
				dataIndex: 'id',
				key: 'id'
			},
			{
				// title: 'Email',
				title: <FormattedMessage id="user.table.colum.email" defaultMessage="Email" />,
				dataIndex: 'email',
				key: 'email',
				...this.getColumnSearchProps('email')
			},
			{
				// title: 'Email',
				title: <FormattedMessage id="user.table.colum.firstName" defaultMessage="First Name" />,
				dataIndex: 'firstName',
				key: 'firstName',
				...this.getColumnSearchProps('firstName')
			},
			{
				// title: 'Email',
				title: <FormattedMessage id="user.table.colum.lastName" defaultMessage="Last Name" />,
				dataIndex: 'lastName',
				key: 'lastName',
				...this.getColumnSearchProps('lastName')
			},
			{
				// title: 'Activated',
				title: <FormattedMessage id="user.table.colum.activated" defaultMessage="Activated" />,
				dataIndex: 'activated',
				key: 'activated',
				align: 'center',
				render: activated => {
					return !activated ? (
						<Icon type="close-circle" theme="twoTone" twoToneColor="#FF0000" />
					) : (
						<Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" />
					);
				}
			}
		];

		return (
			<div className={classes.contentPadding}>
				<Table
					rowSelection={rowSelection}
					columns={columns}
                    pagination={{pageSize: 50}}
					// scroll={{ x: true }}
					dataSource={data}
					onRow={e => ({
						onClick: () => {
							Router.pushRoute(`/users-detail/${e.id}`);
						}
					})}
					rowKey="id"
				/>
			</div>
		);
	}
}
