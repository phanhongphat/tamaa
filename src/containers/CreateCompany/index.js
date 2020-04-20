import React, { PureComponent } from 'react';
import {
	Form,
	Row,
	Col,
	Button,
	Divider,
	Typography,
	Card,
	message,
	Icon,
	Tooltip,
	Radio,
	Tag,
	Dropdown,
	Menu
} from 'antd';
const { Text } = Typography;

// components
import Breadcrumb from 'src/components/Breadcrumb';
import OpenHouse from 'src/components/OpenHouse';
import Email from 'src/components/Validate/Email';
import TextInput from 'src/components/Validate/TextInput';
import SelectInput from 'src/components/Validate/SelectInput';
import PhoneNumber from 'src/components/Validate/PhoneNumber';

import NumericInput from 'src/components/Input/NumericInput';

import SampleButton from 'src/containers/CompanyDetail/Credits/CreditConditions/NormalDay/button';
import { sortByAlphabet } from 'src/constants';

// jss
import styles from './styles';
import injectSheet from 'react-jss';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createCompany } from 'src/redux/actions/companies';
import { getListIsland } from 'src/redux/actions/island';
import { getListTowns } from 'src/redux/actions/town';
import { Router } from 'src/routes';

const mapStateToProps = state => ({
	store: state.companies,
	detail: state.companies.detail,
	error: state.companies.error,
	islands: state.islands.list,
	towns: state.towns.list
});

const optionalDate = {
	monday: ['00:00-23:59'],
	tuesday: ['00:00-23:59'],
	wednesday: ['00:00-23:59'],
	thursday: ['00:00-23:59'],
	friday: ['00:00-23:59'],
	saturday: ['00:00-23:59'],
	sunday: ['00:00-23:59'],
	exceptions: {}
};

const defaultState = {
	email: undefined,
	name: undefined,
	island: undefined,
	city: undefined,
	address: undefined,
	phoneNumber1: undefined,
	phoneNumber2: undefined,
	dailyAmount: undefined,
	description: undefined,
	value: 1,
	loading: false,
	openingHour: {}
};

const mapDispatchToProps = dispatch => ({
	action: bindActionCreators(
		{
			createCompany,
			getListIsland,
			getListTowns
		},
		dispatch
	)
});

message.config({
	maxCount: 1
});

@connect(
	mapStateToProps,
	mapDispatchToProps
)
@injectSheet(styles)
@Form.create()
class CreateCompany extends PureComponent {
	state = defaultState;
	handlecreateCompany = e => {
		e.preventDefault();
		let amount = null;
		const { setFields } = this.props.form;

		this.props.form.validateFieldsAndScroll((err, values) => {
			amount = values['dailyAmount'];
			if (!err) {
				console.log('Received values of form: ', values);
			}
		});

		const {
			email,
			name,
			island,
			city,
			address,
			phoneNumber1,
			phoneNumber2,
			description,
			openingHour,
			value
		} = this.state;

		// if (email === undefined) return;
		// else {
		const payload = {
			email,
			name,
			description,
			address,
			phoneNumber1: phoneNumber1,
			phoneNumber2,
			companyConditions: value === 1 ? { ...optionalDate } : { ...openingHour },
			dailyAmount: value === 1 ? null : parseInt(amount),
			island,
			city,
			restriction: value === 1 ? true : false
		};
		// console.log(payload);
		// return;
		this.props.action.createCompany(
			payload,
			res => {
				const {
					detail: { data = {} },
					error = {}
				} = this.props.store;

				this.setState({ loading: false });
				if (error && error.violations && error.violations.length > 0) {
					error.violations.map(e => {
						// message.error(e.message);
						const err = {
							email: 'email',
							name: 'société',
							phoneNumber1: 'numéro de téléphone',
							phoneNumber2: 'numéro de téléphone'
						};
						setFields({
							[e.propertyPath]: {
								errors: [new Error(`Veuillez saisir votre ${err[e.propertyPath]}`)]
							}
						});
						setTimeout(
							() =>
								setFields({
									[e.propertyPath]: {}
								}),
							1000
						);
					});
				} else if (data && data.id) {
					message.success('Ajouter une société accepté');
					Router.pushRoute(`/company-detail/${data.id}`);
				}
			},
			() => this.setState({ loading: false })
		);
		// }
	};

	onChange = (e, name) => {
		if (name === 'island') {
			this.props.action.getListTowns(
				() => this.setState({ loading: false }),
				() => this.setState({ loading: false }),
				{
					island: e,
					pagination: false
				}
			);
			this.setState({ [name]: `/api/islands/${e}` });
		} else this.setState({ [name]: `/api/cities/${e}` });
		this.props.form.setFieldsValue({ cities: undefined });
	};

	getNormalDay = days => {
		this.setState({ normalDay: { ...days } });
	};

	getExceptionDay = days => {
		this.setState({ exceptionDay: { ...days } });
	};

	componentDidMount() {
		this.props.action.getListIsland(
			() => this.setState({ loading: false }),
			() => this.setState({ loading: false }),
			{
				pagination: false
			}
		);
	}

	onGetStateChange = (name, value) => {
		this.setState({ [name]: value });
	};

	resetForm = () => {
		this.setState(defaultState);
		this.props.form.setFieldsValue(defaultState);
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
		const { getFieldDecorator } = this.props.form;
		const towns = sortByAlphabet(this.props.towns.data, 'cityName');
		const islands = sortByAlphabet(this.props.islands.data, 'islandName');
		const { value } = this.state;
		const routes = [
			{
				path: '/companies',
				breadcrumbName: 'Société'
			},
			{
				breadcrumbName: 'Ajouter une société'
			}
		];
		const menu = (
			<Menu>
				<Menu.Item key="restaurant-create-reset" onClick={this.resetForm}>
					<Icon type="undo" />
					Réinitialiser
				</Menu.Item>
			</Menu>
		);

		const _Title = props => (
			<Col span={props.size}>
				<Text strong>{props.title}</Text>
			</Col>
		);

		// console.log(islands); <_Title size={} title=""/>

		return (
			<>
				<Breadcrumb breadcrumb={routes} />
				<Card style={{ minHeight: 360, marginTop: '16px' }} bordered={false}>
					<Form onSubmit={this.handlecreateCompany}>
						<Row>
							<_Title size={12} title="Ajouter une société" />

							<Col span={12} style={{ textAlign: 'right' }}>
								<Dropdown overlay={menu} trigger="click">
									<Icon type="more" />
								</Dropdown>
							</Col>
						</Row>
						<Divider />
						{/*  */}
						<Row style={{ padding: '20px 40px' }}>
							<_Title size={6} title="Information" />

							<Col span={18} md={24} lg={24} xl={18}>
								{/* email */}
								<Email
									name="Email"
									stateName="email"
									form={this.props.form}
									onChange={this.onGetStateChange}
								/>
								{/* company name */}
								<TextInput
									name="Nom de la société"
									stateName="name"
									form={this.props.form}
									onChange={this.onGetStateChange}
									area="1"
									validate={true}
								/>
								{/* description */}
								<TextInput
									name="Description"
									stateName="description"
									form={this.props.form}
									onChange={this.onGetStateChange}
									area="0"
								/>
								{/* phone number */}
								<PhoneNumber
									name="Numéro de téléphone"
									stateName="phoneNumber1"
									form={this.props.form}
									onChange={this.onGetStateChange}
									validation={true}
								/>
								<PhoneNumber
									name="Numéro de téléphone 2"
									stateName="phoneNumber2"
									form={this.props.form}
									onChange={this.onGetStateChange}
									validation={false}
								/>
								{/* address */}
								<TextInput
									name="Adresse"
									stateName="address"
									form={this.props.form}
									onChange={this.onGetStateChange}
									area="1"
								/>
								<Row>
									{/* island */}

									{/* {islands.map((a, b) => console.log(a))} */}

									<Col span={11}>
										<SelectInput
											name="Île"
											stateName="island"
											form={this.props.form}
											onChange={this.onGetStateChange}
											data={islands}
											callCity={this.onChange}
										/>
									</Col>
									<Col span={2} />
									<Col span={11}>
										<SelectInput
											name="Commune"
											stateName="city"
											form={this.props.form}
											onChange={this.onGetStateChange}
											data={towns.sort((a, b) => a.cityName > b.cityName)}
											callCity={this.onChange}
										/>
									</Col>
								</Row>
							</Col>

							<Divider />

							<_Title size={4} title="CONDITIONS DE CRÉDIT" />

							<Col md={24} lg={24} xl={20} push={2} style={{ float: 'center' }}>
								<Row>
									<Col md={24} lg={24} xl={18} style={{ paddingBottom: '15px' }}>
										<Text strong>JOUR AUTORISÉ</Text>`
										<div style={{ padding: '7px' }} />
										<Radio.Group
											defaultValue={1}
											onChange={e => this.setState({ value: e.target.value })}
											style={{ marginBottom: '10px' }}>
											<Radio value={1} style={{ margin: 0 }}>
												No restriction
											</Radio>
											<Tooltip title="Pas de restrictions: lorsque vous appliquez cette règle, l'entreprise et ses employés peuvent payer à tout moment de 00h00 à 23h59 et ne pas avoir de limite sur le montant journalier.">
												<Tag style={{ marginRight: 10 }}>?</Tag>
											</Tooltip>
											<Radio value={2}>Custom</Radio>
										</Radio.Group>
										{value === 2 && <OpenHouse setDataOutput={this.setDataOutput} />}
									</Col>
								</Row>
								{value === 2 && (
									<Row>
										<Col>
											<Text strong style={{ marginRight: '5px' }}>
												Montant journalier
											</Text>
											<Tooltip
												style={{ marginLeft: '5px' }}
												title="Maximum journalier que l'employé peut acheter par jour">
												<Tag>?</Tag>
											</Tooltip>
										</Col>
										<Col md={20} lg={15} xl={11}>
											<Form.Item colon={false} labelCol={{ span: 24 }} labelAlign={'left'}>
												{getFieldDecorator('dailyAmount', {
													initialValue: null
												})(
													<NumericInput
														negative={false}
														float={false}
														// onChange={this.onGetStateChange}
														placeholder="Montant journalier"
													/>
												)}
											</Form.Item>
										</Col>
									</Row>
								)}
							</Col>
						</Row>{' '}
						<Button.Group style={{ float: 'right', marginRight: '35px' }}>
							<SampleButton name="Annuler" action={() => Router.pushRoute('/companies')} />{' '}
							<SampleButton
								name="Sauvegarder"
								htmlSubmit="submit"
								type="primary"
								loading={this.state.loading}
							/>
						</Button.Group>
					</Form>
				</Card>
			</>
		);
	}
}

export default CreateCompany;
