import {
	Form,
	Icon,
	Input,
	Button,
	Divider,
	Dropdown,
	Select,
	Menu,
	Radio,
	Modal,
	DatePicker,
	Checkbox,
	Row,
	Col,
	Cascader,
	Typography,
	message,
	Layout,
	Tag,
	Card,
	Tooltip
} from 'antd';
import React, { PureComponent, Fragment } from 'react';
import DateSelected from '../DateSelected';
import HeaderContent from '../../../components/HeaderContent';
import injectSheet from 'react-jss';
import styles from './styles';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import moment from 'moment';
import { createNewEmployee, getListEmployees } from 'src/redux/actions/employee.js';
import { getListCompanies, getCompanieInfo } from 'src/redux/actions/companies.js';
import { Router } from '../../../routes';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

import ConditionList from './ConditionList';
import NumericInput from 'src/components/Input/NumericInput';

import OpenHouse from 'src/components/OpenHouse';
import InputEdit from 'src/containers/CompanyDetail/_Details/InputEdit';
import AuthStorage from 'src/utils/AuthStorage';

const { MonthPicker, RangePicker, WeekPicker, TimePicker } = DatePicker;
const { Option } = Select;
const { Text, Title } = Typography;
let companies = [];

const icon = { name: 'more' };

function hasErrors(fieldsError) {
	return Object.keys(fieldsError).some(field => fieldsError[field]);
}

function mapStateToProps(state) {
	return {
		store: {
			user: state.employees.list,
			detailEmployee: state.employees.detail.data,
			companies: state.companies.list.data,
			companyDetail: state.companies.detail.data,
			error: state.employees.error
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				getListEmployees,
				createNewEmployee,
				getListCompanies,
				getCompanieInfo
			},
			dispatch
		)
	};
};

let conditions = {};

@injectSheet(styles)
@connect(
	mapStateToProps,
	mapDispatchToProps
)
class CreateEmployeeForm extends PureComponent {
	state = {
		value: 0, // value of checkbox
		visible: false,
		loadingSubmit: false,
		enableCompanyConditions: false,
		companies: [],
		fakeCreditConditions: {},
		amountDailyValue: '',
		companyName: '',
		normalDay: [],
		exceptionDay: [],
		companyDailyAmount: 0,
		listCompany: [],
		openingHour: []
	};

	componentDidMount() {
		const { isTama, isCompany, idInfo } = AuthStorage;
		// To disabled submit button at the beginning.
		//this.props.form.validateFields();
		if (isTama) {
			this.getListEmployees();
			this.getListCompanies();

			this.props.companyId && this.handleCompanyChange(this.props.companyId);
		} else if (isCompany) {
			this.getCompanyDetailInfo();
			this.setState({ enableCompanyConditions: true, value: 1 });
		}
	}

	getListCompanies = () => {
		this.props.action.getListCompanies(
			{ pagination: false },
			res => this.setState({ loading: false, companies: res }),
			() => this.setState({ loading: false })
		);
	};

	getCompanyDetailInfo = () => {
		const { idInfo } = AuthStorage;
		const {
			store: { companyDetail = {} }
		} = this.props;
		this.props.action.getCompanieInfo(
			{ id: idInfo },
			() => this.setState({ loading: false, companyDailyAmount: companyDetail.dailyAmount }),
			() => this.setState({ loading: false })
		);
	};

	showModal = () => {
		this.setState({
			visible: true
		});
	};

	getListEmployees = () => {
		this.props.action.getListEmployees(
			{ pagination: false },
			() => {
				this.setState({ loading: false });
			},
			() => {
				this.setState({ loading: false });
			}
		);
	};

	getValueAmountDaily = value => {
		this.setState({
			amountDailyValue: value
		});
	};

	handleSubmit = e => {
		e.preventDefault();
		const {
			store: { companyDetail = {} }
		} = this.props;
		const { value, normalDay, exceptionDay } = this.state;

		if (value === 1) {
			conditions = { ...companyDetail.companyConditions };
		} else {
			conditions = {
				...this.state.openingHour
			};
		}

		this.props.form.validateFields((err, fieldsValue) => {
			const { isTama, isCompany, idInfo } = AuthStorage;
			this.setState({
				loadingSubmit: true
			});
			// switcher()
			if (!err) {
				// this.setState({ loadingSubmit: true });
				let company = '';
				let dailyAmount = 0;

				if (isTama) {
					dailyAmount =
						this.state.value === 1
							? this.props.store.companyDetail.dailyAmount
							: parseInt(fieldsValue['dailyAmount']);
					company = 'api/companies/' + (this.props.companyId ? this.props.companyId : fieldsValue['company']);
				} else if (isCompany) {
					dailyAmount =
						this.state.value === 1 ? companyDetail.dailyAmount : parseInt(fieldsValue['dailyAmount']);
					company = 'api/companies/' + companyDetail.id;
				}

				const data = {
					email: fieldsValue['email'],
					firstName: fieldsValue['firstName'],
					lastName: fieldsValue['lastName'],
					phoneNumber: '689' + fieldsValue['phoneNumber'],
					joinDate: moment().format('YYYY-MM-DD'),
					employeeConditions: Object.keys(conditions).length > 0 ? conditions : this.state.openingHour,
					// this.state.fakeCreditConditions,
					company: company,
					dailyAmount:
						this.state.value === 1
							? this.props.store.companyDetail.dailyAmount
							: parseInt(fieldsValue['dailyAmount'])
					// nullable =================================================
					// expirationDate,
					// user,
				};

				this.setState({
					loading: true
				});
				// console.log(data);
				// return;
				this.props.action.createNewEmployee(
					data,
					resp => {
						// const {
						// 	store: { error = {}, detailEmployee = {} }
						// } = this.props;
						// console.log('detailEmployee', error);
						// console.log('detailEmployee', detailEmployee);
						// if (this.props.companyId) {
						// 	message.success('Create employee is success').then(() => {
						// 		Router.pushRoute(`/company-detail/${this.props.companyId}`);
						// 	});
						// 	this.setState({
						// 		loading: false,
						// 		loadingSubmit: true
						// 	});
						// } else if (error.violations && error.violations.length >= 1) {
						// 	message.error(error.detail);
						// 	this.setState({
						// 		loading: false,
						// 		loadingSubmit: false
						// 	});
						// } else {
						// 	message.success('Create employee is success').then(() => {
						// 		Router.pushRoute(`/employee-details/${detailEmployee.id}`);
						// 	});
						// 	this.setState({
						// 		loading: false,
						// 		loadingSubmit: true
						// 	});
						// }

						const {
							store: { error = {}, detailEmployee = {} }
						} = this.props;
						console.log('detailEmployee', error);
						console.log('detailEmployee', detailEmployee);
						if (this.props.companyId) {
							message.success('Create employee is success').then(() => {
								Router.pushRoute(`/company-detail/${this.props.companyId}`);
							});
							this.setState({
								loading: false,
								loadingSubmit: true
							});
						} else if (resp.detail) {
							this.setState(
								{
									loading: false,
									loadingSubmit: false
								},
								() => {
									message.error(resp.detail);
								}
							);
							message.error(resp.detail).then(() => {
								this.setState({
									loading: false,
									loadingSubmit: false
								});
							});
						} else {
							// message.success('Create employee is success').then(() => {
							// 	Router.pushRoute(`/employee-details/${detailEmployee.id}`);
							// });
							this.setState(
								{
									loading: false,
									loadingSubmit: true
								},
								() => {
									message.success('Create employee is success').then(() => {
										Router.pushRoute(`/employee-details/${detailEmployee.id}`);
									});
								}
							);
						}
					},
					nextErr => {}
				);

				// if (this.state.amountDailyValue !== '' || this.state.amountDailyValue !== 0) {

				// } else {
				// 	this.setState({ messageDailyAmount: true });
				// }
			}
		});
	};

	handleChange = value => {
		console.log(`selected ${value}`);
	};

	handleOk = e => {
		console.log(e);
		this.setState({
			visible: false
		});
	};

	linkToEmployeeList = () => {
		Router.pushRoute('/employees');
	};

	handleCancel = key => {
		return function(e) {
			var state = {};
			state[key] = e.target.value;
			this.setState(state);
		}.bind(this);
	};

	_onChangeRadioCheckbox = e => {
		console.log('radio checked', e.target.value);
		e.target.value === 1 ? (conditions = {}) : null;
		this.setState({
			value: e.target.value
		});
		if (e.target.value === 1) {
			this.setState({ fakeCreditConditions: { ...this.props.store.companyDetail.companyConditions } });
		}
	};

	handleReset = () => {
		this.props.form.resetFields();
	};

	handleCompanyChange = id => {
		this.setState({ enableCompanyConditions: true, value: 1 });
		const payload = {
			id: id,
			pagination: false
		};
		this.props.action.getCompanieInfo(
			payload,
			async next => {
				console.log(next);
				await this.setState({
					loading: false,
					companyDailyAmount: this.props.store.companyDetail.dailyAmount,
					fakeCreditConditions: {
						...(this.props.store.companyDetail.companyConditions || { normalDay: {} })
					},
					companyName: next.name,
					dailyAmountCompany: next && next.dailyAmount
				});
				this.props.action.getListCompanies(
					{ pagination: false },
					() => this.setState({ loading: false }),
					() => this.setState({ loading: false })
				);
			},
			() => this.setState({ loading: false })
		);
	};

	getNormalDay = days => {
		this.setState({ normalDay: { ...days } });
	};

	getExceptionDay = days => {
		this.setState({ exceptionDay: { ...days } });
	};

	companySearch = e => {
		const temp = [...this.state.companies];
		const companyList = temp.sort((a, b) => {
			return a.name.localeCompare(b.name);
		});
		this.setState({ listCompany: companyList.filter(item => item.name.toLowerCase().match(e.toLowerCase())) });
	};

	setDataOutput = data => {
		const noException = ({ monday, tuesday, wednesday, thursday, friday, saturday, sunday, ...rest }) => rest;
		const exceptions = noException(data);

		const normal = {
			monday: data.monday,
			tuesday: data.tuesday,
			wednesday: data.wednesday,
			thursday: data.thursday,
			friday: data.friday,
			saturday: data.saturday,
			sunday: data.sunday
		};
		this.setState({ openingHour: { ...normal, exceptions } });
	};

	render() {
		console.log(this.state.openingHour);
		// companies = this.props.store.companies ? this.props.store.companies : []s
		const {
			store: { companies = [], companyDetail = {} }
		} = this.props;
		// console.log('companies ==>', companies);
		const { classes, form } = this.props;
		const { getFieldDecorator } = this.props.form;
		const { fakeCreditConditions, companyDailyAmount } = this.state;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				lg: { span: 6 }
			},
			wrapperCol: {
				xs: { span: 24 },
				lg: { span: 18 }
			}
		};

		// console.log(fakeCreditConditions);
		// console.log(this.state.normalDay, this.state.exceptionDay)
		// companies.length > 0 ? console.log(companies[this.props.companyId]['name']) : ''
		const formTwoItemLayout = {
			labelCol: {
				xs: { span: 6 },
				lg: { span: 12 }
			},
			wrapperCol: {
				xs: { span: 18 },
				lg: { span: 12 }
			}
		};
		// console.log(this.state.companies);
		const temp = [...this.state.companies];
		const companyList = temp.sort((a, b) => {
			return a.name.localeCompare(b.name);
		});
		const { getFieldsError, getFieldValue } = this.props.form;
		const { isTama, isCompany } = AuthStorage;
		const options = this.state.listCompany.map(item => (
			<Option key={item.id} value={item.id}>
				{item.name}
			</Option>
		));
		return (
			<Col span={24}>
				<Form {...formItemLayout} onSubmit={this.handleSubmit}>
					<div>
						<div>
							<Row className={classes.headerBar} type="flex" align="middle" justify="space-between">
								<Col>
									<Row>
										{/* <HeaderContent name={ 'Create employee'} id={`# 123456`} /> */}
										<h3>
											<strong>
												<FormattedMessage
													id="employee.create"
													defaultMessage="Create employee"
												/>
											</strong>
										</h3>
									</Row>
								</Col>
								<Col>
									<Dropdown
										className={[classes.moreOptions]}
										placement="bottomRight"
										overlay={
											<Menu>
												<Menu.Item key="restaurant-create-reset" onClick={this.handleReset}>
													<Icon type="undo" />
													<FormattedMessage id="reset" defaultMessage="Reset" />
												</Menu.Item>
											</Menu>
										}>
										<Icon type="more" />
									</Dropdown>
								</Col>
								<Divider />
							</Row>
						</div>
						<div>
							<Row>
								<Text>Information</Text>
							</Row>
							<Row type="flex" justify="center">
								<Col span={21} offset={3}>
									<Form.Item label="Email" labelAlign="left">
										{getFieldDecorator('email', {
											rules: [
												{
													type: 'email',
													message: (
														<FormattedMessage
															id="empoloyee.notValidEmail"
															defaultMessage="The input is not valid E-mail!"
														/>
													)
												},
												{
													required: true,
													message: (
														<FormattedMessage
															id="empoloyee.emptyEmail"
															defaultMessage="Please input your E-mail!"
														/>
													)
												}
											]
										})(<Input placeholder="Votre email..." />)}
										<Text>
											<FormattedMessage
												id="createEmail.note"
												defaultMessage="Email password will be automatically generated and sent
                                            to the company's email when the account is created"
											/>
										</Text>
									</Form.Item>
									<div>
										<Form.Item
											label={<FormattedMessage id="firstName" defaultMessage="First name" />}
											labelAlign="left">
											{getFieldDecorator('firstName', {
												rules: [
													{
														max: 20,
														message: (
															<FormattedMessage
																id="empoloyee.notValidFirstName"
																defaultMessage="First name should have 20 characters or less!"
															/>
														)
													},
													{
														required: true,
														message: (
															<FormattedMessage
																id="empoloyee.emptyFirstName"
																defaultMessage="Please input your first name!"
															/>
														)
													}
												]
											})(<Input placeholder="Votre prénom..." />)}
										</Form.Item>
									</div>
									<div>
										<Form.Item
											label={<FormattedMessage id="lastName" defaultMessage="Last name" />}
											labelAlign="left">
											{getFieldDecorator('lastName', {
												rules: [
													{
														max: 20,
														message: (
															<FormattedMessage
																id="empoloyee.notValidLastName"
																defaultMessage="Last name should have 20 characters or less!"
															/>
														)
													},
													{
														required: true,
														message: (
															<FormattedMessage
																id="empoloyee.emptyLastName"
																defaultMessage="Please input your last name!"
															/>
														)
													}
												]
											})(<Input placeholder="Votre nom..." />)}
										</Form.Item>
									</div>
									<div>
										{isTama && (
											<Form.Item
												label={<FormattedMessage id="company" defaultMessage="Company" />}
												labelAlign="left">
												{getFieldDecorator('company', {
													initialValue:
														companyList.length > 0 && this.props.companyId
															? companyList[this.props.companyId - 1]['name']
															: '',
													rules: [
														!this.props.companyId
															? {
																	required: true,
																	message: (
																		<FormattedMessage
																			id="empoloyee.emptyCompany"
																			defaultMessage="Please select your company!"
																		/>
																	)
															  }
															: {}
													]
												})(
													!this.props.companyId ? (
														<Select
															showSearch
															onSearch={this.companySearch}
															placeholder="Votre entreprise..."
															disabled={this.props.companyId ? true : false}
															filterOption={false}
															onFocus={() => this.companySearch(' ')}
															onChange={this.handleCompanyChange}>
															{options}
														</Select>
													) : (
														<Text>{companyDetail.name && companyDetail.name}</Text>
													)
												)}
											</Form.Item>
										)}
										{isCompany && (
											<Form.Item
												label={<FormattedMessage id="company" defaultMessage="Company" />}
												labelAlign="left">
												{getFieldDecorator('company', {
													initialValue:
														companies.length > 0 && this.props.companyId
															? companies[this.props.companyId - 1]['name']
															: '',
													rules: [
														!this.props.companyId
															? {
																	required: true,
																	message: (
																		<FormattedMessage
																			id="empoloyee.emptyCompany"
																			defaultMessage="Please select your company!"
																		/>
																	)
															  }
															: {}
													]
												})(<Text>{companyDetail.name && companyDetail.name}</Text>)}
											</Form.Item>
										)}
										{/* {isCompany && <Input disabled={true} value={companyDetail.name} />} */}
									</div>
									<div>
										<Form.Item
											label={
												<FormattedMessage
													id="employees.phoneNumber"
													defaultMessage="Phone number"
												/>
											}
											labelAlign="left">
											{getFieldDecorator('phoneNumber', {
												rules: [
													{
														required: true,
														message: (
															<FormattedMessage
																id="empoloyee.emptyPhoneNumber"
																defaultMessage="Please input your phone number!"
															/>
														)
													},
													{
														min: 7,
														max: 9,
														message:
															'Le numéro de téléphone doit comporter entre 7 et 9 caractères (ne pas inclure +689)'
													}
												]
											})(
												<NumericInput
													negative={false}
													float={false}
													addonBefore="+689"
													//className={classes.inputGroup}
													placeholder="Numéro de téléphone"
												/>
											)}
										</Form.Item>
									</div>
								</Col>
							</Row>
						</div>
					</div>
					<Divider />
					<div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
						<Row>
							<Col span={24}>
								<Text>
									<FormattedMessage
										id="employee.creditCondition"
										defaultMessage="Conditions de crédit"
									/>
								</Text>
							</Col>
							<Col span={24} offset={3}>
								<Radio.Group
									className={classes.fullWidth}
									onChange={this._onChangeRadioCheckbox}
									value={this.state.value}>
									<Radio
										value={1}
										className={classes.radioButtons}
										disabled={!this.state.enableCompanyConditions}>
										<FormattedMessage id="company.conditions" defaultMessage="Company conditions" />
									</Radio>
									{this.state.enableCompanyConditions && this.state.value === 1 && (
										<Fragment>
											{fakeCreditConditions !== undefined ? (
												<ConditionList
													conditions={
														(companyDetail && companyDetail.companyConditions) ||
														fakeCreditConditions
													}
													companyDailyAmount={companyDetail && companyDetail.dailyAmount}
													_key2="exceptions"
													id={this.props.id}
												/>
											) : (
												<Tag color="red">
													<FormattedMessage
														id="date.invalid"
														defaultMessage="INVALID DATE FORMAT"
													/>
												</Tag>
											)}
										</Fragment>
									)}
									<Radio
										value={2}
										className={classes.radioButtons}
										disabled={!this.state.enableCompanyConditions}>
										<FormattedMessage id="empoloyee.custom" defaultMessage="Custom" />
									</Radio>
									{this.state.enableCompanyConditions && this.state.value === 2 && (
										<Fragment>
											<Row type="flex" justify="center">
												<Col span={20}>
													<Text strong>
														<FormattedMessage
															id="empoloyee.dayAccept"
															defaultMessage="DAY ACCEPTED"
														/>
													</Text>
													<div style={{ padding: '4px', width: '140%' }} />
													<OpenHouse setDataOutput={this.setDataOutput} />

													<Col span={12}>
														<Form.Item
															colon={false}
															labelCol={{ span: 24 }}
															label={
																<>
																	<FormattedMessage
																		id="empoloyee.dailyAmount"
																		defaultMessage="Daily Amount"
																	/>
																	<Tooltip title="Max daily amount that employee can purchase per day">
																		<Tag>?</Tag>
																	</Tooltip>
																</>
															}
															labelAlign={'left'}>
															{getFieldDecorator('dailyAmount', {
																rules: [
																	{
																		required: true,
																		message: `S'il vous plaît entrer le montant quotidien maximum`
																	},
																	{
																		max: 999999999,
																		message:
																			'La plage de quantité quotidienne de 0 à 999999999 '
																	}
																]
															})(
																<NumericInput
																	negative={false}
																	float={false}
																	//className={classes.inputGroup}
																	placeholder="Montant journalier"
																/>
															)}
														</Form.Item>
													</Col>
												</Col>
											</Row>
										</Fragment>
									)}
								</Radio.Group>
							</Col>
						</Row>
					</div>
					<Divider />
					<Row type="flex" justify="end" gutter={10}>
						<Col>
							{this.props.companyId ? (
								<Button
									type="deafult"
									onClick={() => Router.pushRoute(`/company-detail/${this.props.companyId}?tab=2`)}>
									<FormattedMessage id="cancel" defaultMessage="Cancel" />
								</Button>
							) : (
								<Button type="deafult" onClick={this.linkToEmployeeList}>
									<FormattedMessage id="cancel" defaultMessage="Cancel" />
								</Button>
							)}
						</Col>
						<Col>
							<Button
								className={[classes.rightButtons]}
								type="primary"
								// icon="loading"
								htmlType="submit"
								disabled={hasErrors(getFieldsError())}
								loading={this.state.loadingSubmit}>
								<FormattedMessage id="employees.create" defaultMessage="Create new employee" />
							</Button>
						</Col>
					</Row>
				</Form>
			</Col>
		);
	}
}

export const WrappedCreateEmployeeForm = Form.create({ name: 'create-employee-form' })(CreateEmployeeForm);
