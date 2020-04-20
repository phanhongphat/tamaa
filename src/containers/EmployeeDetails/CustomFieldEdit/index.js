import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getListCompanies, getCompanieInfo } from 'src/redux/actions/companies.js';
import injectSheet from 'react-jss';
import { Form, Input, Button, Typography, DatePicker, Row, Col, Select, message } from 'antd';
import styles from './styles';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import ButtonGroup from 'antd/lib/button/button-group';
const { Text } = Typography;

function mapStateToProps(state) {
	return {
		store: {
			companies: state.companies.list.data,
			companyDetail: state.companies.detail.data
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				getListCompanies,
				getCompanieInfo
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
export default class CustomFieldEditor extends PureComponent {
	state = {
		loading: true,
		editEnable: false,
		fieldInfo: {
			name: 'defaultValue',
			value: 'defaultValue',
			editEnable: false
		},
		buttonTextEdit: <FormattedMessage id="edit" defaultMessage="Edit" />,
		buttonTextSave: <FormattedMessage id="save" defaultMessage="Save" />,
		buttonTextCancel: <FormattedMessage id="cancel" defaultMessage="Cancel" />,
		inputWidth: '300px',
		isFieldValue: false,
		isStandardFoneNumber: false,
		isFonenumberField: false
	};

	onChangeDate = value => {
		this.props.onChange(value);
	};

	handleCompanyChange = id => {
		console.log(id);
		this.props.getIdCompany(id);
	};

	getListDataCompanies = () => {
		this.props.action.getListCompanies(
			() => this.setState({ loading: false }),
			() => this.setState({ loading: false })
		);
	};
	render() {
		const { name, value, classes } = this.props;
		let valueFone = '';
		if (name === 'phoneNumber') {
			valueFone = value.slice(4);
		}
		console.log(valueFone);
		const {
			store: { companies = [] }
		} = this.props;
		const { getFieldDecorator, getFieldValue } = this.props.form;
		return (
			<Row>
				{this.state.editEnable ? (
					<Input.Group compact className={classes.inputGroup}>
						<Row type="flex" justify="space-between">
							{this.props.type !== 'datePicker' && (
								<Col>
									<>
										{name !== 'company' && name !== 'phoneNumber' && (
											<Input
												name={name}
												defaultValue={value}
												style={{
													width: this.state.inputWidth,
													marginBottom: '8px',
													marginTop: '8px'
												}}
												onChange={e => {
													console.log(e.target.value);
													this.props.onChange(e.target.value);
													if (e.target.value !== '') {
														this.setState({ isFieldValue: true });
													} else {
														this.setState({ isFieldValue: false });
													}
												}}
											/>
										)}
										{name === 'phoneNumber' && (
											<Input
												addonBefore="+689"
												name={name}
												defaultValue={valueFone}
												maxlength={8}
												minlength={4}
												style={{ width: this.state.inputWidth }}
												onChange={e => {
													console.log(e.target.value);
													this.props.onChange('+689' + e.target.value);
													const foneNumberString = String(e.target.value);
													if (foneNumberString.length < 7 || foneNumberString.length > 9) {
														this.setState({
															isStandardFoneNumber: true,
															isFonenumberField: true
														});
													} else {
														this.setState({
															isStandardFoneNumber: false,
															isFonenumberField: false
														});
													}
													if (e.target.value !== '') {
														this.setState({ isFieldValue: true });
													} else {
														this.setState({ isFieldValue: false });
													}
												}}
											/>
										)}
										{name === 'company' && (
											<Form.Item>
												{getFieldDecorator('company', {
													rules: [
														{
															required: true,
															message: (
																<FormattedMessage
																	id="empoloyee.emptyCompany"
																	defaultMessage="Please select your company!"
																/>
															)
														}
													]
												})(
													<Select
														style={{ width: this.state.inputWidth }}
														placeholder="Your company..."
														onChange={this.handleCompanyChange}>
														{companies.map(item => (
															<Option value={item.id}>{item.name}</Option>
														))}
													</Select>
												)}
											</Form.Item>
										)}
									</>
								</Col>
							)}
							{this.props.type && this.props.type === 'datePicker' && (
								<Col span={8}>
									<DatePicker
										showTime
										format="YYYY-MM-DD HH:mm:ss"
										placeholder={value}
										onChange={this.onChangeDate}
									/>
								</Col>
							)}
							<Col>
								<Row type="flex">
									<Button.Group>
										<Button
											type="primary"
											htmlType="submit"
											onClick={() => {
												if (
													this.state.isFieldValue &&
													this.state.isStandardFoneNumber === false
												) {
													this.props.handleSave();
													this.setState({
														editEnable: false
													});
													// } else if (
													// 	this.state.isFieldValue &&
													// 	this.state.isStandardFoneNumber === true &&
													// 	this.state.isFonenumberField === true
													// ) {
													// 	this.setState({
													// 		editEnable: true
													// 	});
													// 	message.error(
													// 		'Phone number just contains 7 - 9 numbers, not including +689'
													// 	);
												} else {
													this.setState({
														editEnable: true
													});
													message.error('Please input the field!');
												}
											}}>
											{this.state.buttonTextSave}
										</Button>
										<Button
											style={{ border: '1px solid lightgrey' }}
											onClick={() => {
												this.setState({
													editEnable: false
												});
											}}>
											{this.state.buttonTextCancel}
										</Button>
									</Button.Group>
								</Row>
							</Col>
						</Row>
					</Input.Group>
				) : (
					<Input.Group compact>
						<Row style={{ display: 'flex', alignContent: 'center' }}>
							{name === 'firstName' || name === 'lastName' ? (
								<Col span={20} className={classes.rowTextEdit__textBolder}>
									<Text style={{ marginTop: '6px', wordBreak: 'break-word' }}>{value}</Text>
								</Col>
							) : (
								<Col span={20} className={classes.rowTextEdit__text}>
									<Text style={{ marginTop: '6px', wordBreak: 'break-word' }}>{value}</Text>
								</Col>
							)}
							<Col span={4}>
								<Button
									type="link"
									icon="form"
									onClick={() => {
										this.getListDataCompanies();
										this.setState({
											editEnable: true
										});
										console.log('Edit', this.state.fieldInfo);
									}}>
									{this.state.buttonTextEdit}
								</Button>
							</Col>
						</Row>
					</Input.Group>
				)}
			</Row>
		);
	}
}
