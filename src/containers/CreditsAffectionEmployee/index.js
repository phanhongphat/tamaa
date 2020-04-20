import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import injectSheet from 'react-jss';
import { affectCredit } from 'src/redux/actions/affectCredit';
import {
	message,
	Input,
	Card,
	Icon,
	Menu,
	Dropdown,
	Divider,
	Row,
	Modal,
	Form,
	Button,
	Typography,
	Col,
	Tag
} from 'antd';
import { getAffectionListEmployee } from 'src/redux/actions/creditAffectionEmployee.js';
import HeaderContent from 'src/components/HeaderContent';
import TableEmployee from 'src/containers/CreditsAffectionEmployee/Table';
import { getListEmployees, searchEmployee } from 'src/redux/actions/employee.js';
import styles from './styles';
import CONSTANTS from 'src/constants';
import AuthStorage from '../../utils/AuthStorage';
import { Router } from '../../routes';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import Breadcrumb from 'src/components/Breadcrumb';
import NumericInput from 'src/components/Input/NumericInput';
const { Text, Title } = Typography;
const { Search } = Input;

function numberWithSpaces(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function mapStateToProps(state) {
	return {
		store: {
			credits: state.creditsAffectionEmployee.list,
			user: state.employees.list,
			searchList: state.employees.searchList,
			message: state.message
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				getAffectionListEmployee,
				getListEmployees,
				searchEmployee,
				affectCredit
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
export default class CreditsAffectionEmployee extends PureComponent {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		// slug: PropTypes.string.isRequired,
		// store
		store: PropTypes.shape({
			credits: PropTypes.object.isRequired
		}),
		// action
		action: PropTypes.shape({
			getListEmployee: PropTypes.func.isRequired
		})
	};

	static defaultProps = {};

	state = {
		loading: true,
		selectedRows: [],
		visible: false,
		confirmLoading: false,
		currentBalances: 0,
		totalBalances: 0,
		errorBalances: false,
		employeeData: [],
		employeeDataSearch: [],
		searchValue: false,
		listId: []
	};

	componentDidMount() {
		this.props.action.getListEmployees(
			{
				company: this.props.id,
				pagination: false
			},
			res => {
				this.setState({
					loading: false,
					name: res[0].company.name,
					employeeData: this.props.store.user.data,
					currentBalances: res && res.length > 0 && res[0].company.balance
				});
			},
			() => {
				this.setState({ loading: false });
			}
		);
	}
	getListEmployees = () => {
		this.props.action.getListEmployees(
			{
				company: this.props.id,
				pagination: false
			},
			() => {
				this.setState({ loading: false, employeeData: this.props.store.user.data });
			},
			() => {
				this.setState({ loading: false });
			}
		);
	};

	validateWithCurrentBalances = (rule, value, callback) => {
		if (value % 1 !== 0) {
			callback(`* S'il vous plaît entrer entier uniquement`);
		} else {
			let totalBalances = value * this.state.listId.length;
			this.setState({ totalBalances, balance: value });
		}
	};

	setListId = listId => {
		console.log('listId', listId);
		this.setState({ listId: [...listId] });
	};

	handleOk = () => {
		// this.setState({
		//     ModalText: 'The modal will be closed after two seconds',
		//     confirmLoading: true
		// });
		const _id = [];
		this.state.listId.map(row => _id.push(Number(row.user.id)));

		const payload = {
			listID: _id,
			amount: this.state.balance,
			noteMain: this.state.noteMain ? this.state.noteMain : null,
			noteSub: this.state.noteSub ? this.state.noteSub : null
		};
		this.props.action.affectCredit(
			payload,
			res => {
				const { message: data = {} } = this.props.store;
				console.log(data);
				this.setState({ loading: false });
				if (data.message.data.statusCode && data.message.data.statusCode === 200) {
					message.success(data.message.data.message);
					if (this.state.searchValue) {
						this.handleSearch(this.state.searchString);
					} else {
						this.getListEmployees();
					}
				} else {
					message.error(data.message.data.message);
					//this.getListEmployees();
				}
			},
			() => this.setState({ loading: false })
		);
		setTimeout(() => {
			this.setState({
				visible: false,
				confirmLoading: false,
				totalBalances: 0
			});
		}, 2000);
	};

	// handleSubmit = e => {
	// 	e.preventDefault();
	// 	let valueAmount = 0;
	// 	this.props.form.validateFields((err, values) => {
	// 		valueAmount = values[''];
	// 		const _id = [];
	// 		this.state.listId.map(row => _id.push(Number(row.user.id)));

	// 		const payload = {
	// 			listID: _id,
	// 			amount: values['affect'],
	// 			noteMain: values['note1'],
	// 			noteSub: values['note2']
	// 		};

	// 		this.props.action.affectCredit(
	// 			payload,
	// 			res => {
	// 				this.setState({ loading: false });
	// 				if (res.statusCode && res.statusCode === 200 && res.message.includes('Crédit affecté réussi')) {
	// 					message.success(res.message);
	// 					this.getListEmployees();
	// 				} else {
	// 					message.error(res.message);
	// 					//this.getListEmployees();
	// 				}
	// 			},
	// 			() => this.setState({ loading: false })
	// 		);
	// 		setTimeout(() => {
	// 			this.setState({
	// 				visible: false,
	// 				confirmLoading: false
	// 			});
	// 		}, 2000);
	// 	});
	// };

	showModal = () => {
		this.setState({
			visible: true
		});
	};

	handleCancel = () => {
		this.setState({
			visible: false,
			totalBalances: 0
		});
	};

	// validateWithCurrentBalances = (rule, value, callback) => {
	// 	if (value % 1 !== 0) {
	// 		callback(`* Please input integer only`);
	// 	} else {
	// 		let totalBalance = value * this.state.listId.length;
	// 		this.setState({ totalBalance, balance: value });
	// 	}
	// };

	setSelected = selectedRows => {
		this.setState({ selectedRows });
	};

	handleSearch = searchStr => {
		if (searchStr === '') {
			this.getListEmployees();
		}

		const { isTama, isCompany, isRestaurant, isEmployee, idInfo, email } = AuthStorage;
		let payload = {
			params: {
				query: searchStr,
				company_Id: this.props.id
			}
		};
		this.props.action.searchEmployee(
			{
				...payload
			},
			res => {
				const { searchList } = this.props.store;
				console.log(searchList);
				this.setState({
					searchValue: true,
					searchString: searchStr,
					loading: false,
					employeeData: [...res]
				});
			},
			() => {
				this.setState({ loading: false });
			}
		);
	};

	clearSearch = searchString => {
		if (searchString.length > 0) return;
		else {
			this.getListEmployees();
		}
	};

	render() {
		const {
			classes,
			store: { credits = {} }
		} = this.props;

		const { getFieldDecorator, getFieldValue } = this.props.form;
		const dataExport = this.state.employeeData.length > 0 && this.state.employeeData;

		getFieldDecorator('keys', { initialValue: [] });
		// const keys = getFieldValue('keys');

		console.log(this.state.listId.length);
		const menu = (
			<Menu>
				{/* <Menu.Item
					key="restaurant-more-affect"
					onClick={this.showModal}
					disabled={this.state.listId.length === 0}>
					<Button onClick={this.showModal} className="ant-btn ant-btn-link" disabled={this.state.listId.length === 0}>
						<Icon type="dollar" />
						<FormattedMessage id="affect" defaultMessage="Affect" />
					</Button>
				</Menu.Item> */}
				{/* <Menu.Item key="affection-employee-more-affect-by-csv">
					<Button className="ant-btn ant-btn-link" disabled={this.state.listId.length === 0}>
						<Icon type="import" />
						<FormattedMessage id="affectByCSV" defaultMessage="Affect by CSV" />
					</Button>
				</Menu.Item> */}
				<Menu.Item key="affection-employee-more-download">
					<Button className="ant-btn ant-btn-link" disabled={this.state.listId.length === 0}>
						<Icon type="download" />
						<FormattedMessage id="download" defaultMessage="Download sample file" />
					</Button>
				</Menu.Item>
				<Menu.Item key="affection-employee-more-export">
					<Button className="ant-btn ant-btn-link" disabled={this.state.listId.length === 0}>
						<Icon type="export" />
						<FormattedMessage id="export" defaultMessage="Export" />
					</Button>
				</Menu.Item>
			</Menu>
		);
		const routes = [
			{
				path: '/credits-affection',
				breadcrumbName: (
					<FormattedMessage id="breadcrumb.creditsAffection" defaultMessage="Crédits Affection Solde" />
				)
			},
			{
				breadcrumbName: this.state.name
			}
		];
		const {
			store: { user = [] }
		} = this.props;
		return (
			<>
				<Breadcrumb
					breadcrumb={routes}
					//  title="ss"
				/>
				<Card style={{ minHeight: 360, marginTop: '16px' }} bordered={false}>
					<Row className={classes.headerBar} type="flex" align="middle" justify="space-between">
						<Col span={14} md={12}>
							{/* <HeaderContent name={'Affect Employees'} /> */}
							<h3>
								<strong>
									<FormattedMessage id="employees.affect" defaultMessage="Affect Employees" />
								</strong>
							</h3>
						</Col>
						<Col span={10} md={12}>
							<Row type="flex" justify="end" align="middle">
								<Col>
									<Search
										placeholder="Search in all fields"
										className={classes.btnSearch}
										onSearch={value => this.handleSearch(value)}
										onChange={e => this.clearSearch(e.target.value)}
									/>
								</Col>
								<Col>
									<Button
										onClick={this.showModal}
										className="ant-btn ant-btn-link"
										disabled={this.state.listId.length === 0}>
										<Icon type="dollar" />
										<FormattedMessage id="affect" defaultMessage="Affect" />
									</Button>
								</Col>
								<Col>
									<Dropdown
										className={classes.moreOptions}
										overlay={menu}
										placement="bottomRight"
										trigger={['click']}>
										<Icon type="more" />
									</Dropdown>
								</Col>
							</Row>
						</Col>
					</Row>
					<Modal
						destroyOnClose={true}
						title={<FormattedMessage id="credit.affectEmployee" defaultMessage="Affect Employees" />}
						visible={this.state.visible}
						onOk={this.handleOk}
						confirmLoading={this.state.confirmLoading}
						onCancel={this.handleCancel}
						footer={[
							<Button key="back" onClick={this.handleCancel}>
								<FormattedMessage id="cancel" defaultMessage="Cancel" />
							</Button>,
							<Button key="affect" type="primary" loading={this.state.loading} onClick={this.handleOk}>
								<FormattedMessage id="nav.credits.affection" defaultMessage="Affect" />
							</Button>
						]}>
						<Form>
							<Card style={{ padding: 0, fontWeight: 'bold', boxShadow: '3px 3px #f2f2f2' }}>
								<Row type="flex" justify="space-between">
									<Col style={{ marginTop: '8px' }}>
										<Row type="flex" align="middle">
											<Text>
												<FormattedMessage
													id="employees.balance"
													defaultMessage="Current balance"
												/>
											</Text>
										</Row>
										<Row>
											<Col style={{ marginTop: '10px' }}>
												<Text className={classes.currentBalances}>
													{numberWithSpaces(this.state.currentBalances)}{' '}
												</Text>
												<Text
													style={{ fontSize: '8px', color: '#00c68e', fontWeight: 'bolder' }}>
													{` ` + CONSTANTS.CURRENCY}
												</Text>
											</Col>
										</Row>
									</Col>
									<Col style={{ padding: 0 }}>
										<Form.Item
											style={{ margin: 0 }}
											label={
												<FormattedMessage
													id="amountEachEmployee"
													defaultMessage="Amount of each employee"
												/>
											}>
											{getFieldDecorator('affect', {
												rules: [
													{
														validator: this.validateWithCurrentBalances
													}
												]
											})(
												<NumericInput
													style={{
														// textAlign: 'right',
														fontWeight: 'bolder',
														color: '#00c68e',
														fontSize: '20px',
														width: '235px'
													}}
													negative={false}
													float={false}
													onChange={value => {
														this.setState({ balance: value });
													}}
												/>
											)}
										</Form.Item>
									</Col>
								</Row>
								<Divider></Divider>
								<Row type="flex" justify="space-between">
									<Col>
										<Text style={this.state.errorBalances ? { color: 'red' } : { color: 'unset' }}>
											<FormattedMessage id="employees.totalBalance" defaultMessage="Total" />:
										</Text>
									</Col>

									<Col
										style={{
											backgroundColor: '#f2f2f2',
											width: '235px',
											color: '#00c68e',
											fontSize: '20px',
											fontWeight: 'bolder',
											height: '33px',
											padding: '2px 11px',
											border: '0.99px solid #f2f2f2'
										}}>
										<Row type="flex" align="middle">
											{numberWithSpaces(this.state.totalBalances)} {CONSTANTS.CURRENCY}
										</Row>
									</Col>
								</Row>
							</Card>

							<Form.Item className={classes.inputNote}>
								<Input.Group compact>
									{getFieldDecorator('note1', {
										rules: []
									})(<Input className={classes.inputGroup} placeholder="Note 1" />)}
									{getFieldDecorator('note2', {
										rules: []
									})(<Input className={classes.inputGroup} placeholder="Note 2" />)}
								</Input.Group>
							</Form.Item>
						</Form>
					</Modal>
					<div className={classes.main}>
						<TableEmployee
							isSearch={false}
							selectedRows={this.state.selectedRows}
							setSelected={this.setSelected}
							data={this.state.employeeData}
							setListId={this.setListId}
						/>
						{/* {(user.data === [] || user.data.length <= 0) && (
							<Text>
								<FormattedMessage id="noEmployees" defaultMessage="No employee(s)" />
							</Text>
						)} */}
					</div>
				</Card>
			</>
		);
	}
}
