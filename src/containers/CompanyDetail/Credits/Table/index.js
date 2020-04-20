import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';

import { Row, Col, Layout, DatePicker, Table } from 'antd';
const { RangePicker } = DatePicker;

import { getTransactionsByUserId } from 'src/redux/actions/transactions';
import TransactionTable from '../../../Transactions/Table';
import styles from './styles';
import CONSTANTS from 'src/constants';
import injectSheet from 'react-jss';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import AuthStorage from 'src/utils/AuthStorage';
const mapStateToProp = state => ({
	store: {
		transactions: state.transactions.list
	}
});

const mapDispatchToProps = dispatch => ({
	action: bindActionCreators(
		{
			getTransactionsByUserId
		},
		dispatch
	)
});

function numberWithSpaces(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

@connect(
	mapStateToProp,
	mapDispatchToProps
)
@injectSheet(styles)
export default class CreditTable extends PureComponent {
	state = {
		from: null,
		to: null,
		employeeName: ''
	};

	componentDidMount() {
		this.getListTransactions();
	}

	// getListTransactions(dates) {
	// 	const payload = {
	// 		creditor: '/api/users/' + this.props.id,
	// 		'type[0]': '2',
	// 		// type: '/api/transactions_types/2',
	// 		pagination: false
	// 	};
	// 	// console.log(dates);
	// 	if (dates) {
	// 		payload['date[after]'] = moment(dates[0]).startOf('date');
	// 		payload['date[before]'] = moment(dates[1]).endOf('date');
	// 	}

	// 	this.props.action.getListTransactions(
	// 		payload,
	// 		() => {
	// 			this.setState({ loading: false });
	// 		},
	// 		() => {
	// 			this.setState({ loading: false });
	// 		}
	// 	);
	// }

	getListTransactions = () => {
		const { isTama, isCompany, idInfo, userId, email } = AuthStorage;
		//console.log(idInfo);
		if (isTama) {
			const payload = {
				'type[0]': 'AFFECTION',
				// query: this.props.email,
				company_Id: this.props.companyId,
				pagination: false
			};
			this.props.action.getTransactionsByUserId(
				payload,
				() => this.setState({ loading: false }),
				() => this.setState({ loading: false })
			);
		} else if (isCompany) {
			const payload = {
				'type[0]': 'AFFECTION',
				// query: email,
				company_Id: idInfo,
				pagination: false
			};
			this.props.action.getTransactionsByUserId(
				payload,
				() => {
					this.setState({ loading: false });
				},
				() => {
					this.setState({ loading: false });
				}
			);
		}
	};

	handleFilterDatesTransactions = (e, dataString) => {
		const { isTama, isCompany, isRestaurant, idInfo, email } = AuthStorage;
		let payload = {};
		// if (e[0] && e[1]) {
		// 	e[0] = moment(e[0]).startOf('date');
		// 	e[1] = moment(e[1]).endOf('date');
		// }
		const temp1 = String(dataString[0]);
		const temp2 = String(dataString[1]);
		const date1 = moment(temp1, 'DD/MM/YYYY').format('YYYY-MM-DD 00:00:00');
		const date2 = moment(temp2, 'DD/MM/YYYY').format('YYYY-MM-DD 23:59:59');

		if (isTama) {
			payload = {
				'date[after]': date1,
				'date[before]': date2,
				'type[0]': 'AFFECTION',
				// query: this.props.email,
				company_Id: this.props.companyId,
				pagination: false
			};
		} else if (isCompany) {
			payload = {
				'date[after]': date1,
				'date[before]': date2,
				'type[0]': 'AFFECTION',
				// query: email,
				company_Id: idInfo,
				pagination: false
			};
		}

		if (e[0] && e[1]) {
			this.props.action.getTransactionsByUserId(
				payload,
				() => this.setState({ loading: false }),
				() => this.setState({ loading: false })
			);
		}
		//  else {
		// 	this.getListTransactions();
		// }
	};

	render() {
		// let transactions = [];
		// transactions = this.props.store ? this.props.store.transactions.data : [];

		const {
			store: {
				transactions: { data = [] }
			}
		} = this.props;

		const dataSource = [];
		const columns = [
			{
				title: 'ID',
				dataIndex: 'transactionId',
				key: 'transactionId'
				// sorter: true,
				// ...this.getColumnSearchProps('id')
			},
			{
				title: 'Sender',
				dataIndex: 'debitor',
				key: 'debitor',
				render: debitor =>
					`${debitor.firstName ? debitor.firstName : ''} ${debitor.lastName ? debitor.lastName : ''}`
			},
			{
				title: 'Receiver',
				dataIndex: 'creditor',
				key: 'creditor',
				render: creditor =>
					`${creditor.firstName ? creditor.firstName : ''} ${creditor.lastName ? creditor.lastName : ''}`
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
				title: 'Amount',
				dataIndex: 'amount',
				key: 'amount',
				align: 'right',
				render: (amount, user) =>
					user.creditor.roles.toString() === 'ROLE_EMPLOYEE'
						? '-' + numberWithSpaces(amount) + ' ' + CONSTANTS.CURRENCY
						: '+' + numberWithSpaces(amount) + ' ' + CONSTANTS.CURRENCY
			},
			{
				title: 'Note 1',
				dataIndex: 'noteMain',
				key: 'note1'
			},
			{
				title: 'Note 2',
				dataIndex: 'noteSub',
				key: 'note2'
			}
		];
		// console.log(transactions);
		// transactions
		// 	.sort((a, b) => b.id - a.id)
		// 	.map(transaction =>
		// 		dataSource.push({
		// 			id: transaction.id,
		// 			date: new Date(transaction.date).toLocaleString(),
		// 			amount: transaction.amount,
		// 			noteMain: transaction.noteMain,
		// 			noteSub: transaction.noteSub,
		// 			debitor: transaction.debitor && transaction.debitor.email
		// 		})
		// 	);

		console.log(data);

		return (
			<Layout style={{ backgroundColor: 'white', marginTop: '30px' }}>
				<Row>
					<Col span={12}>
						<RangePicker
							style={{ width: '74%' }}
							onChange={e => this.handleFilterDatesTransactions(e)}
							ranges={{
								Today: [moment().startOf('date'), moment().endOf('date')],
								'This Month': [moment().startOf('month'), moment().endOf('month')]
							}}
							format="DD/MM/YYYY"
						/>
					</Col>
				</Row>
				<Table dataSource={data.sort((a, b) => b.id - a.id)} columns={columns} />
			</Layout>
		);
	}
}
