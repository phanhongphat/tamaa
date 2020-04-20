import React, { PureComponent, Fragment } from 'react';
import injectSheet from 'react-jss';
import { Table, Divider, Tag, Checkbox, Input, Button, Tabs, Icon } from 'antd';
const { TabPane } = Tabs;

import Highlighter from 'react-highlight-words';

import styles from './styles';

// {
//  title: 'Tags',
//  key: 'tags',
//  dataIndex: 'tags',
//  render: tags => (
//      <span>
//          {tags.map(tag => (
//              <Tag color="blue" key={tag}>
//                  {tag}
//              </Tag>
//          ))}
//      </span>
//  )
// },
// {
// 	title: 'Action',
// 	key: 'action',
// 	render: (text, record) => (
// 		<span>
// 			<a href="javascript:;">Invite {record.name}</a>
// 			<Divider type="vertical" />
// 			<a href="javascript:;">Delete</a>
// 		</span>
// 	)
// }

// const data = [
//  {
//      key: '1',
//      name: 'John Brown',
//      age: 32,
//      address: 'New York No. 1 Lake Park',
//      tags: ['nice', 'developer']
//  },
//  {
//      key: '2',
//      name: 'Jim Green',
//      age: 42,
//      address: 'London No. 1 Lake Park',
//      tags: ['loser']
//  },
//  {
//      key: '3',
//      name: 'Joe Black',
//      age: 32,
//      address: 'Sidney No. 1 Lake Park',
//      tags: ['cool', 'teacher']
//  }
// ];

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
		const { classes, data } = this.props;

		const columns = [
			{
				title: 'ID',
				dataIndex: 'id',
				key: 'id',
				...this.getColumnSearchProps('id')
			},
			{
				title: 'User name',
				dataIndex: 'surName',
				key: 'username',
				...this.getColumnSearchProps('username')
			},
			{
				title: 'Email',
				dataIndex: 'email',
				key: 'email',
				...this.getColumnSearchProps('email')
			},
			{
				title: 'credit Affect',
				dataIndex: 'creditAffect',
				key: 'creditAffect',
				...this.getColumnSearchProps('creditAffect')
			},
			{
				title: 'daily Amounts',
				dataIndex: 'dailyAmounts',
				key: 'dailyAmounts',
				...this.getColumnSearchProps('dailyAmounts')
			}
		];
		return (
			// <div className={classes.main}>
			<Fragment>
				<Table style={{ cursor: 'pointer' }} columns={columns} dataSource={data} />
			</Fragment>
			// </div>
		);
	}
}
