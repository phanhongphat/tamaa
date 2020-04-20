import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import injectSheet from 'react-jss';
import { Layout, Input, Icon, Menu, Dropdown, Button, message, DatePicker, Card, Col, Row, Typography } from 'antd';
import { getListTransactions } from 'src/redux/actions/transactions.js';
import Table from 'src/containers/EmployeeDetails/Transactions/Table';
import styles from './styles';
import { getTransactionsByUserId, getTransactionsByUserIdOfEmployee } from 'src/redux/actions/transactions.js';
import moment from 'moment';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import BtnExport from 'src/components/Button/BtnExport';
const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Search } = Input;
function mapStateToProps(state) {
	return {
		store: {
			transactions: state.transactions.list
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				getListTransactions,
				getTransactionsByUserId,
				getTransactionsByUserIdOfEmployee
			},
			dispatch
		)
	};
};

@injectSheet(styles)
@connect(
	mapStateToProps,
	mapDispatchToProps
)
export default class EmployeeTransactionsContainer extends PureComponent {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		// slug: PropTypes.string.isRequired,
		// store
		store: PropTypes.shape({
			user: PropTypes.object.isRequired
		}),
		// action
		action: PropTypes.shape({
			getListEmployee: PropTypes.func.isRequired
		})
	};

	static defaultProps = {};

	state = {
		loading: true,
		isClickedFilter: false,
		visible: false
	};

	componentDidMount() {
		const { user: user = {} } = this.props;
		const payload = {
			'type[0]': 'PAYMENT',
			query: user.data.user.customId && user.data.user.customId,
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

	handleFilterDatesTransactions = (e, dataString) => {
		const { user: user = {} } = this.props;

		const { email } = user.data;

		// if (e[0] && e[1]) {
		// 	const payload = {
		// 		'date[after]': e[0],
		// 		'date[before]': e[1],
		// 		'type[0]': 1,
		// 		query: id
		// 	};
		// 	this.props.action.getTransactionsByUserId(
		// 		payload,
		// 		() => this.setState({ loading: false }),
		// 		() => this.setState({ loading: false })
		// 	);
		// }
		const temp1 = String(dataString[0]);
		const temp2 = String(dataString[1]);
		const date1 = moment(temp1, 'DD/MM/YYYY').format('YYYY-MM-DD 00:00:00');
		const date2 = moment(temp2, 'DD/MM/YYYY').format('YYYY-MM-DD 23:59:59');
		if (e[0] && e[1]) {
			e[0] = moment(e[0]).startOf('date');
			e[1] = moment(e[1]).endOf('date');

			// if (e[0] === e.[1])
			const payload = {
				'date[after]': date1,
				'date[before]': date2,
				'type[0]': 'PAYMENT',
				query: email,
				pagination: false
			};
			this.props.action.getTransactionsByUserId(
				payload,
				() => this.setState({ loading: false }),
				() => this.setState({ loading: false })
			);
		} else {
			const payload = {
				'type[0]': 'PAYMENT',
				query: email,
				pagination: false
			};
			this.props.action.getTransactionsByUserId(
				payload,
				() => this.setState({ loading: false }),
				() => this.setState({ loading: false })
			);
		}
	};

	render() {
		const {
			classes,
			store: { user = {}, transactions = {} }
		} = this.props;

		// console.log(transactions);
		// let datas = [];
		// transactions.data.map((item, index) => {
		// 	item['restaurantName'] = '';
		// 	datas.push(item);
		// });
		// console.log(datas);
		return (
			<Card style={{ minHeight: 360, marginTop: '16px' }} bordered={false}>
				<Row type="flex" justify="space-between">
					{/* <Col style={{ padding: '8px 0' }}>
						<Search
							placeholder="Search in all fields"
							className={classes.btnSearch}
							onSearch={value => console.log(value)}
						/>
					</Col> */}
					<Col>
						<Row type="flex" justify="start" align="middle" style={{ height: '100%' }}>
							<RangePicker
								className={classes.creditDatePicker}
								ranges={{
									Today: [moment().startOf('date'), moment().endOf('date')],
									'This Month': [moment().startOf('month'), moment().endOf('month')]
								}}
								format="DD/MM/YYYY"
								onChange={this.handleFilterDatesTransactions}
							/>
						</Row>
					</Col>
					<Col style={{ padding: '8px 0' }}>
						<Row>
							<Col span={12}>
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
									filename="Transaction_Employee-list.csv"
								/>
							</Col>
						</Row>
					</Col>
				</Row>
				<Row className={classes.main}>
					<Table data={transactions.data} />
				</Row>
			</Card>
		);
	}
}
