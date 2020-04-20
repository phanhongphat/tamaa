import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import moment from 'moment';
import { Row, Col, Card, Input, DatePicker, Button, Divider, Icon, Spin } from 'antd';
const { RangePicker } = DatePicker;
const { Search } = Input;

import TransactionTable from './Table';
import styles from './styles';
import BtnExport from 'src/components/Button/BtnExport';
//redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
	getListTransactions,
	filterTransactions,
	getCreditsByUserId,
	getTransactionsByUserId
} from 'src/redux/actions/transactions';
import { getUserInfo } from 'src/redux/actions/user';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import Breadcrumb from 'src/components/Breadcrumb';
import AuthStorage from 'src/utils/AuthStorage';

function mapStateToProps(state) {
	return {
		store: {
			transactions: state.transactions.list,
			users: state.user,
			credits: state.transactions.listCredits
		}
	};
}

const mapDispatchToProps = dispatch => ({
	action: bindActionCreators(
		{
			getListTransactions,
			getUserInfo,
			filterTransactions,
			getCreditsByUserId,
			getTransactionsByUserId
		},
		dispatch
	)
});

@connect(
	mapStateToProps,
	mapDispatchToProps
)
@injectSheet(styles)
export default class TransactionContainer extends PureComponent {
	state = {
		loading: true,
		selectedRows: []
	};

	componentDidMount() {
		this.rerender();
	}

	rerender = () => {
		const { isTama, isRestaurant, idInfo, userId, email } = AuthStorage;
		//console.log(idInfo);
		if (isTama) {
			const payload = {
				'type[0]': 'PAYMENT',
				pagination: false
			};
			this.props.action.getTransactionsByUserId(
				payload,
				() => this.setState({ loading: false }),
				() => this.setState({ loading: false })
			);
		} else if (isRestaurant) {
			const payload = {
				'type[0]': 'PAYMENT',
				query: email,
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
	restructure(transactions) {
		//
		return transactions;
	}

	// addEmailDebitorToTransactionData = () => {
	// 	const {
	// 		store: { transactions = {} }
	// 	} = this.props;
	// 	transactions.map(item => {
	// 		const idDebitor = item.debitor.id;
	// 		const params = { idDebitor };

	// 		this.getUserInfor(params);
	// 	});
	// };

	getUserInfor = filter => {
		this.setState({ loading: true });
		const pramas = filter ? filter : this.filter;
		this.props.action.getUserInfo(
			pramas,
			() => {
				this.setState({ loading: false });
			},
			() => {
				this.setState({ loading: false });
			}
		);
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
				'type[0]': 'PAYMENT',
				pagination: false
			};
		} else if (isRestaurant) {
			payload = {
				'date[after]': date1,
				'date[before]': date2,
				'type[0]': 'PAYMENT',
				query: email,
				pagination: false
			};
		}
		if (e[0] && e[1]) {
			this.props.action.getTransactionsByUserId(
				payload,
				() => this.setState({ loading: false }),
				() => this.setState({ loading: false })
			);
		} else {
			this.rerender();
		}
	};

	render() {
		const {
			classes,
			store: { transactions = {}, credits = {} }
		} = this.props;

		const { loading } = this.state;

		const routes = [
			{
				breadcrumbName: 'Transactions'
			}
		];

		const { isTama, isCompany, isRestaurant, idInfo } = AuthStorage;
		return (
			<>
				<Breadcrumb breadcrumb={routes} />
				<Card style={{ minHeight: 360, marginTop: '16px' }} bordered={false}>
					<Row>
						<Col span={8}>
							<h3>Transactions</h3>
						</Col>
					</Row>
					<Row className={classes.wrapperHeaderTitle} type="flex" justify="space-between">
						<Col span={8}>
							<RangePicker
								ranges={{
									Today: [moment(), moment()],
									'This Month': [moment().startOf('month'), moment().endOf('month')]
								}}
								format="DD/MM/YYYY"
								onChange={this.handleFilterDatesTransactions}
							/>
						</Col>

						<Col span={8}>
							<Row type="flex" justify="end">
								{/* <Col>
								<Search
									placeholder="Search in all fields"
									className={classes.btnSearch}
									onSearch={value => console.log(value)}
								/>
							</Col> */}
								<Col>
									{/* <Button className={classes.formButton} value="export" icon="export" type="primary">
									Export
								</Button> */}
									<BtnExport
										data={transactions.data}
										textBtn={
											<Button
												className={classes.formButton}
												value="export"
												icon="export"
												type="primary">
												<FormattedMessage id="export" defaultMessage="Export" />
											</Button>
										}
										filename="transactions.csv"
									/>
								</Col>
							</Row>
						</Col>
					</Row>
					<Row>
						<Spin spinning={loading}>
							{isTama && transactions.data && (
								<TransactionTable
									selectedRows={this.state.selectedRows}
									setSelected={this.setSelected}
									data={this.restructure(transactions.data)}
								/>
							)}
							{isRestaurant && (
								<TransactionTable
									selectedRows={this.state.selectedRows}
									setSelected={this.setSelected}
									data={this.restructure(transactions.data)}
								/>
							)}
						</Spin>
					</Row>
				</Card>
			</>
		);
	}
}
