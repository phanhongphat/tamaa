import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import { Table, Input } from 'antd';

import styles from './styles';

const fakeData = [
	{
		id: '123456',
		employee: 'Employee 1',
		amount: 50000,
		note1: '',
		note2: ''
	},
	{
		id: '230697',
		employee: 'Employee 2',
		amount: 25000,
		note1: '',
		note2: ''
	},
	{
		id: '280289',
		employee: 'Employee 3',
		amount: 25000,
		note1: '',
		note2: ''
	}
];

function numberWithSpaces(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

@injectSheet(styles)
export default class TableList extends PureComponent {
	state = {};

	render() {
		const { classes, data } = this.props;

		const columns = [
			{
				title: 'ID',
				dataIndex: 'id',
				key: 'id',
				sorter: (a, b) => a.id - b.id
			},
			{
				title: 'Employee',
				dataIndex: 'employee',
				key: 'employee',
				sorter: (a, b) => a.employee.localeCompare(b.employee)
			},
			{
				title: 'Amounts',
				dataIndex: 'amount',
				key: 'amount',
				align: 'right',
				sorter: (a, b) => a.amount - b.amount,
				render: amount => {
					return numberWithSpaces(amount);
				}
			},
			{
				title: 'Note 1',
				dataIndex: 'note1',
				key: 'note1',
				sorter: (a, b) => a.note1.localeCompare(b.note1)
			},
			{
				title: 'Note 2',
				dataIndex: 'note2',
				key: 'note2',
				sorter: (a, b) => a.note2.localeCompare(b.note2)
			}
		];
		return (
			<div>
				<Table pagination={{ pageSize: 50 }} columns={columns} dataSource={fakeData} />
			</div>
		);
	}
}
