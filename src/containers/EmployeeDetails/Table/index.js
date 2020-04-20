import React, { PureComponent, Fragment } from 'react';
import injectSheet from 'react-jss';
import { Table, Divider, Tag, Checkbox } from 'antd';

import styles from './styles';

const columns = [
	{
		title: 'ID',
		dataIndex: 'id',
		key: 'id',
		sorter: true
	},
	{
		title: 'User name',
		dataIndex: 'surName',
		key: 'username'
	},
	{
		title: 'Email',
		dataIndex: 'email',
		key: 'email'
	},
	{
		title: 'credit Affect',
		dataIndex: 'creditAffect',
		key: 'creditAffect'
	},
	{
		title: 'daily Amounts',
		dataIndex: 'dailyAmounts',
		key: 'dailyAmounts'
	}
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
];

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
// rowSelection object indicates the need for row selection
const rowSelection = {
	onChange: (selectedRowKeys, selectedRows) => {
		console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
	},
	getCheckboxProps: record => ({
		disabled: record.name === 'Disabled User', // Column configuration not to be checked
		name: record.name
	})
};
@injectSheet(styles)
export default class TableEmployee extends PureComponent {
	render() {
		const { classes, data } = this.props;
		console.log('classes ===>', this.props);
		return (
			// <div className={classes.main}>
			<Fragment>
				<Table
                    // scroll={{x: true}}
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={data} />
			</Fragment>
			// </div>
		);
	}
}
