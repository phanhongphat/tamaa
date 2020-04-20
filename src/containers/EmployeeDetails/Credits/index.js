import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import injectSheet from 'react-jss';
import { Input, Button, message, DatePicker, Typography, Row, Col, Card, Collapse, Form } from 'antd';

import Table from 'src/containers/EmployeeDetails/Credits/Table';
import styles from './styles';
import { updateUserInfor } from 'src/redux/actions/user.js';
import { getEmployeeDetails, editEmployeeRequest } from 'src/redux/actions/employee';
import { getCreditsByUserId, getCreditsByUserIdOnEmployee } from 'src/redux/actions/transactions.js';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import moment from 'moment';
import BtnExport from 'src/components/Button/BtnExport';
import InputEdit from 'src/containers/CompanyDetail/_Details/InputEdit';

// panh
import ConditionEdit from 'src/containers/CompanyDetail/Credits/CreditConditions/NormalDay/edit';
import CONSTANTS from 'src/constants';
import EditNumeric from 'src/components/Input/EditNumeric';
import { Ruler } from 'src/containers/CompanyDetail/_Details';

const { RangePicker } = DatePicker;
const { Panel } = Collapse;
const { Text, Title } = Typography;

function numberWithSpaces(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function mapStateToProps(state) {
	return {
		store: {
			user: state.employees.detail,
			transactions: state.transactions.listCredits
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				getEmployeeDetails,
				editEmployeeRequest,
				getCreditsByUserId,
				getCreditsByUserIdOnEmployee,
				updateUserInfor
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
@Form.create()
export default class EmployeeCreditsContainer extends PureComponent {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		store: PropTypes.shape({
			user: PropTypes.object.isRequired
		}),
		action: PropTypes.shape({
			getListEmployee: PropTypes.func.isRequired
		})
	};

	static defaultProps = {};

	state = {
		loading: true,
		isClickedFilter: false,
		visible: false,
		isSwitcherOn: true,
		isClickEdit: false,
		activated: false,
		creditActivated: false,
		fakeCreditConditions: {},
		creditHistory: []
	};

	componentDidMount() {
		const { data } = this.props.user;
		const payload = {
			'type[0]': 'AFFECTION',
			query: data.user.customId,
			pagination: false
		};
		this.props.action.getCreditsByUserId(
			payload,
			res => {
				if (res.statusCode !== 404) {
					this.setState({ loading: false, creditHistory: res });
				} else {
					this.setState({ loading: false, creditHistory: [] });
				}
			},
			() => {
				this.setState({ loading: false });
			}
		);
		this.setState({
			creditActivated: this.props.user.data.creditActivated,
			activated: this.props.user.data.activated,
			loading: false
		});
	}

	success = () => {
		const { creditActivated } = this.state;
		const status = creditActivated ? (
			<FormattedMessage id="activateNow" defaultMessage="Employee is active now" />
		) : (
			<FormattedMessage id="disactiveNow" defaultMessage="Employee is deactivated now" />
		);
		message.success(status);
	};

	handleFilterDatesTransactions = (e, dataString) => {
		const { data } = this.props.user;
		const email = data.email;

		const temp1 = String(dataString[0]);
		const temp2 = String(dataString[1]);
		const date1 = moment(temp1, 'DD/MM/YYYY').format('YYYY-MM-DD 00:00:00');
		const date2 = moment(temp2, 'DD/MM/YYYY').format('YYYY-MM-DD 23:59:59');

		if (e[0] && e[1]) {
			e[0] = moment(e[0]).startOf('date');
			e[1] = moment(e[1]).endOf('date');
			const payload = {
				'date[after]': date1,
				'date[before]': date2,
				'type[0]': 'AFFECTION',
				query: email,
				pagination: false
			};
			this.props.action.getCreditsByUserId(
				payload,
				res => this.setState({ loading: false, creditHistory: res }),
				() => this.setState({ loading: false })
			);
		} else {
			const payload = {
				'type[0]': 'AFFECTION',
				query: email,
				pagination: false
			};
			this.props.action.getCreditsByUserId(
				payload,
				res => this.setState({ loading: false, creditHistory: res }),
				() => this.setState({ loading: false })
			);
		}
	};

	getDetailEmployee = id => {
		const payload = { id };
		this.props.action.getEmployeeDetails(
			payload,
			() => {
				this.setState({
					creditActivated: this.props.user.data.creditActivated,
					activated: this.props.user.data.activated,
					loading: false
				});
			},
			() => {
				this.setState({ loading: false });
			}
		);
	};

	// handleUpdateInformation = (name, value) => {
	//     const { id } = this.props.store.user.data;
	//     const payload = {
	//         id,
	//         [name]: value
	//     };
	//     this.props.action.editEmployeeRequest(
	//         payload,
	//         next => {
	//             this.setState({ loading: false });
	//             if (next.title !== 'An error occurred') {
	//                 this.getDetailEmployee(id);
	//             } else {
	//                 message.error(next.detail);
	//             }
	//         },
	//         nextErr => this.setState({ loading: false })
	//     );
	// };

	render() {
		const {
			classes,
			store: { transactions = {} }
		} = this.props;
		const { user } = this.props;
		const { data } = this.props.store.user;
		const { creditActivated, activated } = data.user;

		const width1 = '75%';
		const width2 = '100%';
		const width = !this.state.isClickEdit ? width1 : width2;

		// panh
		const { employeeConditions, id, restriction } = user.data;
		const noException = ({ exceptions, ...rest }) => rest;
		const normal = noException(employeeConditions);
		const { dailyAmount } = this.props.store.user.data;

		let dataTable = [];
		let creditHistory = this.state.creditHistory;

		creditHistory.map(item => {
			let tempData = { ...item };
			const firstName = item.debitor.firstName ? item.debitor.firstName : '';
			const lastName = item.debitor.lastName ? item.debitor.lastName : '';
			tempData['sender'] = firstName + ' ' + lastName;
			dataTable.push(tempData);
		});

		return (
			<Card bordered={false}>
				<Row type="flex" justify="space-between" align="top">
					<Col>
						<Title level={4}>
							<FormattedMessage id="employee.creditAffection" defaultMessage="Credit affection" />
						</Title>
					</Col>
					<Col>
						<BtnExport
							data={transactions.data}
							textBtn={
								<Button className={classes.formButton} value="export" icon="export" type="link">
									<FormattedMessage id="export" defaultMessage="Export" />
								</Button>
							}
							filename="Credits_Employee-list.csv"
						/>
					</Col>
				</Row>
				{/* 1 */}
				<Row>
					<Col xl={12} md={24} className={classes.currentBalance}>
						<Card style={{ boxShadow: '2px 2px 10px lightgrey' }}>
							<Row type="flex" align="middle" justify="space-between">
								<Col>
									<Text strong>
										<FormattedMessage id="employees.balance" defaultMessage="Current Balance" />
									</Text>
								</Col>
								<Col>
									<Row className={classes.wrapper_currentBalance}>
										<Text className={classes.creditTag}>
											{user.data.balance ? numberWithSpaces(user.data.balance) : 0}
											<span style={{ fontSize: '12px', padding: '0 10px' }}>
												{CONSTANTS.CURRENCY}
											</span>
										</Text>
									</Row>
								</Col>
							</Row>
						</Card>
					</Col>
				</Row>

				{/* 2 */}
				{creditActivated && (
					<>
						<Row>
							<Collapse
								style={{
									boxShadow: '2px 2px 10px lightgrey'
								}}>
								<Panel header="Credit conditions" key="1">
									<>
										<ConditionEdit
											normal={normal !== undefined ? normal : []}
											exceptions={
												employeeConditions['exceptions'] !== undefined
													? employeeConditions['exceptions']
													: []
											}
											stateName="employeeConditions"
											id={id}
											restriction={restriction}
										/>
										<Ruler span={24} />
										<InputEdit
											id={id}
											form={this.props.form}
											name="Montant journalier"
											value={dailyAmount}
											stateName="dailyAmount"
											// reload={this.handleUpdateInformation}
											type="number"
											role="employee"
											size={[5, 5, 14, 0]}
											edit={true}
											isNull={false}
										/>
									</>
								</Panel>
							</Collapse>
						</Row>

						{/* 3 */}
						<Row>
							<Col span={24}>
								<Row type="flex" align="middle" justify="start">
									<Col>
										<Row type="flex" align="middle" style={{ marginTop: '15px' }}>
											<RangePicker
												ranges={{
													Today: [moment(), moment()],
													'This Month': [moment().startOf('month'), moment().endOf('month')]
												}}
												format="DD/MM/YYYY"
												onChange={this.handleFilterDatesTransactions}
											/>
										</Row>
									</Col>
								</Row>
								<Row className={classes.main}>{<Table data={dataTable} />}</Row>
							</Col>
						</Row>
					</>
				)}
			</Card>
		);
	}
}
