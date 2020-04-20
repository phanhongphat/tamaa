import React, { PureComponent, Fragment } from 'react';
import injectSheet from 'react-jss';
import { Table, Divider, Tag, Checkbox, Input, Button, Tabs, Icon } from 'antd';
const { TabPane } = Tabs;
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import Highlighter from 'react-highlight-words';
import styles from './styles';
import CONSTANTS from 'src/constants';
import moment from 'moment';
import AuthStorage from 'src/utils/AuthStorage';

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
				textToHighlight={text ? text.toString() : ''}
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
        const { isTama, isRestaurant } = AuthStorage;
		const { data } = this.props;
		let datas = [];
		const tempDatas =
			data &&
			data.forEach((item, index) => {
				// const n = item;
				let obj = {
					...item
				};
				const firstNameSender = (item.debitor && item.debitor.firstName) || '';
				const lastNameSender = (item.debitor && item.debitor.lastName) || '';
				const firstNameReceiver = (item.creditor && item.creditor.firstName) || '';
				const lastNameReceiver = (item.creditor && item.creditor.lastName) || '';
				// n['Sender'] =
				// 	item.debitor.firstName !== null
				// 		? item.debitor.firstName
				// 		: '' + ' ' + item.debitor.lastName !== null || undefined
				// 		? item.debitor.lastName
				// 		: '';
				// n['Receiver'] =
				// 	item.creditor.firstName !== null || undefined
				// 		? item.creditor.firstName
				// 		: '' + ' ' + item.creditor.lastName !== null || undefined
				// 		? item.creditor.lastName
				// 		: '';
				obj.Sender = firstNameSender + ' ' + lastNameSender;
				obj.Receiver = firstNameReceiver + ' ' + lastNameReceiver;
				datas.push(obj);
			});
		// console.log(data);
		// console.log('datas ==>', datas);
		const columns = [
			{
				title: 'ID',
				dataIndex: 'transactionId',
				key: 'id'
			},
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                render: value => {
                    return moment(value, 'YYYY-MM-DD[T]HH:mm:ss').format('DD-MM-YYYY HH:mm:ss');
                }
            },
			{
				//title: <FormattedMessage id="object" defaultMessage="Object" />,
				title: 'Restaurant',
				dataIndex: 'debitor.lastName',
				key: 'debitor',
				// ...this.getColumnSearchProps('Sender')
			},
			// {
			// 	//title: <FormattedMessage id="object" defaultMessage="Object" />,
			// 	title: 'Receiver',
			// 	dataIndex: 'Receiver',
			// 	key: 'creditor',
			// 	// ...this.getColumnSearchProps('Receiver')
			// },
			{
				title: <FormattedMessage id="amount" defaultMessage="Amounts" />,
				dataIndex: 'amount',
				key: 'amounts',
				align: 'right',
				render: value => numberWithSpaces(value) + ' ' + CONSTANTS.CURRENCY
				// ...this.getColumnSearchProps('amount')
			},
			{
				title: 'Note 1',
				dataIndex: 'noteMain',
				key: 'note1',
				...this.getColumnSearchProps('note1')
				// render: input => <Input placeholder="Free text" />
			},
			{
				title: 'Note 2',
				dataIndex: 'noteSub',
				key: 'note2',
				...this.getColumnSearchProps('note2')
				// render: input => <Input placeholder="Free text" />
			}
		];

        const columnsRestaurant = [
            {
                title: 'ID',
                dataIndex: 'transactionId',
                key: 'id'
            },
            {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                render: value => {
                    return moment(value, 'YYYY-MM-DD[T]HH:mm:ss').format('DD-MM-YYYY HH:mm:ss');
                }
            },
            // {
            //     //title: <FormattedMessage id="object" defaultMessage="Object" />,
            //     title: 'Restaurant',
            //     dataIndex: 'debitor.lastName',
            //     key: 'debitor',
            //     // ...this.getColumnSearchProps('Sender')
            // },
            // {
            // 	//title: <FormattedMessage id="object" defaultMessage="Object" />,
            // 	title: 'Receiver',
            // 	dataIndex: 'Receiver',
            // 	key: 'creditor',
            // 	// ...this.getColumnSearchProps('Receiver')
            // },
            {
                title: <FormattedMessage id="amount" defaultMessage="Amounts" />,
                dataIndex: 'amount',
                key: 'amounts',
                align: 'right',
                render: value => numberWithSpaces(value) + ' ' + CONSTANTS.CURRENCY
                // ...this.getColumnSearchProps('amount')
            },
            {
                title: 'Note 1',
                dataIndex: 'noteMain',
                key: 'note1',
                ...this.getColumnSearchProps('note1')
                // render: input => <Input placeholder="Free text" />
            },
            {
                title: 'Note 2',
                dataIndex: 'noteSub',
                key: 'note2',
                ...this.getColumnSearchProps('note2')
                // render: input => <Input placeholder="Free text" />
            }
        ];

		return (
			<Fragment>
				<Table
					style={{ cursor: 'pointer' }}
					pagination={{ pageSize: 50 }}
					// scroll={{ x: true }}
					columns={isRestaurant ? columnsRestaurant : columns}
					dataSource={datas.sort((a, b) => b.id - a.id)}
				/>
			</Fragment>
		);
	}
}
