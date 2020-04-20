import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getListCompanies, getCompanieInfo } from 'src/redux/actions/companies.js';
import injectSheet from 'react-jss';
import { Form, Input, Button, Typography, DatePicker } from 'antd';
import styles from './styles';

const { Text } = Typography;

function mapStateToProps(state) {
	return {
		store: {
			user: state.employees.list,
			companies: state.companies.list.data,
			companyDetail: state.companies.detail.data
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

@injectSheet(styles)
@connect(
	mapStateToProps,
	mapDispatchToProps
)
@Form.create()
export default class FieldEditor extends PureComponent {
	state = {
		loading: true,
		editEnable: false,
		fieldInfo: {
			name: 'defaultValue',
			value: 'defaultValue',
			editEnable: false
		},
		buttonTextEdit: 'Edit',
		buttonTextSave: 'Save',
		buttonTextCancel: 'Cancel',
		inputWidth: '200px'
	};

	onChangeDate = value => {
		this.props.onChange(value);
	};

	handleCompanyChange = id => {
		this.props.getIdCompany(id);
	};

	getListDataCompanies = () => {
		this.props.action.getListCompanies(
			() => this.setState({ loading: false }),
			() => this.setState({ loading: false })
		);
	};

	render() {
		const { name, value } = this.props;
		const {
			store: { companies = [] }
		} = this.props;
		return (
			<>
				{name !== 'company' && (
					<div>
						{this.state.editEnable ? (
							<Input.Group compact>
								{this.props.type !== 'datePicker' && (
									<Input
										name={name}
										defaultValue={value}
										style={{ width: this.state.inputWidth }}
										onChange={e => {
											console.log(e.target.value);
											this.props.onChange(e.target.value);
										}}
									/>
								)}
								{this.props.type && this.props.type === 'datePicker' && (
									<DatePicker
										showTime
										format="YYYY-MM-DD HH:mm:ss"
										placeholder={value}
										onChange={this.onChangeDate}
									/>
								)}
								<Button
									type="primary"
									onClick={() => {
										this.props.handleSave();
										this.setState({
											editEnable: false
										});
										// console.log('Save', this.state.fieldInfo);
									}}>
									{this.state.buttonTextSave}
								</Button>
								<Button
									type="ghost"
									onClick={() => {
										this.setState({
											editEnable: false
										});
										// console.log('Cancel', this.state.fieldInfo);
									}}>
									{this.state.buttonTextCancel}
								</Button>
							</Input.Group>
						) : (
							<Input.Group compact>
								<div>
									<Text>{value}</Text>
									<Button
										type="link"
										onClick={() => {
											this.setState({
												editEnable: true
											});
											// console.log('Edit', this.state.fieldInfo);
										}}>
										{this.state.buttonTextEdit}
									</Button>
								</div>
							</Input.Group>
						)}
					</div>
				)}
				{name == 'company' && (
					<div>
						{this.state.editEnable ? (
							<Input.Group compact>
								{this.props.type !== 'datePicker' && (
									// <Input
									// 	name={name}
									// 	defaultValue={value}
									// 	style={{ width: this.state.inputWidth }}
									// 	onChange={e => {
									// 		console.log(e.target.value);
									// 		this.props.onChange(e.target.value);
									// 	}}
									// />
									<Form.Item
										label={<FormattedMessage id="company" defaultMessage="Company" />}
										labelAlign="left">
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
											<Select placeholder="Your company..." onChange={this.handleCompanyChange}>
												{companies.map(item => (
													<Option value={item.id}>{item.name}</Option>
												))}
											</Select>
										)}
									</Form.Item>
								)}
								{this.props.type && this.props.type === 'datePicker' && (
									<DatePicker
										showTime
										format="YYYY-MM-DD HH:mm:ss"
										placeholder={value}
										onChange={this.onChangeDate}
									/>
								)}
								<Button
									type="primary"
									onClick={() => {
										this.props.handleSave();
										this.setState({
											editEnable: false
										});
										// console.log('Save', this.state.fieldInfo);
									}}>
									{this.state.buttonTextSave}
								</Button>
								<Button
									type="ghost"
									onClick={() => {
										this.setState({
											editEnable: false
										});
										// console.log('Cancel', this.state.fieldInfo);
									}}>
									{this.state.buttonTextCancel}
								</Button>
							</Input.Group>
						) : (
							<Input.Group compact>
								<div>
									<Text>{value}</Text>
									<Button
										type="link"
										onClick={() => {
											console.log('1');
											this.getListDataCompanies();
											this.setState({
												editEnable: true
											});
											// console.log('Edit', this.state.fieldInfo);
										}}>
										{this.state.buttonTextEdit}
									</Button>
								</div>
							</Input.Group>
						)}
					</div>
				)}
			</>
		);
	}
}
