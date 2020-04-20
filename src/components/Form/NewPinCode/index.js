import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { Form, Icon, Input, Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Link, Router } from 'routes';

import { resetFirstPinCodeRequest } from 'src/redux/actions/auth';
// import AuthStorage from 'src/utils/AuthStorage';
// import Loading from 'src/components/Loading/index.js';

import styles from './styles';

const FormItem = Form.Item;

//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
	return {
		store: {
			auth: state.auth
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				resetFirstPinCodeRequest
			},
			dispatch
		)
	};
};

@connect(
	mapStateToProps,
	mapDispatchToProps
)
@injectSheet(styles)
@Form.create()
export default class ChangePinCodeForm extends PureComponent {
	static propTypes = {
		store: PropTypes.shape({
			auth: PropTypes.object.isRequired
		}).isRequired,
		action: PropTypes.shape({
			changePasswordRequest: PropTypes.func.isRequired
		}).isRequired
	};

	static defaultProps = {};

	state = {
		loading: false
	};

	componentDidMount() {
		// if (AuthStorage.loggedIn && this.props.store.auth.id) {
		// 	Router.pushRoute('/');
		// }
	}

	compareToFirstPinCode = (rule, value, callback) => {
		const { form } = this.props;
		if (value && value !== form.getFieldValue('pinCode')) {
			callback('Two Pin-codes that you enter is inconsistent!');
		} else {
			callback();
		}
	};

	validateToNextPinCode = (rule, value, callback) => {
		const { form } = this.props;
		if (value && this.state.confirmDirty) {
			form.validateFields(['confirm'], { force: true });
		}
		callback();
	};

	// checkLength = (rule, value, callback) => {
	// 	const { form } = this.props;
	// 	if (value.length < 8) {
	// 		callback('It must be between 8 - 12 characters long.');
	// 	}
	// };

	handleSubmit = e => {
		e.preventDefault();
		const { setFields } = this.props.form;
		const { token, roles = '' } = this.props;

		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({
					loading: true
				});
				const payload = {
					params: {
						token,
						new_pin: values.pinCode,
						confirm_pin: values.pinCode
					}
				};

				if (token && token !== '') {
					payload.opt = {
						headers: {
							Authorization: `Bearer ${token}`
						}
					};
				}
				this.props.action.resetFirstPinCodeRequest(
					payload,
					res => {
						if (res.statusCode && res.statusCode === 200) {
							// this.props.handleCancel();
							Modal.success({
								title: res.message,
								onOk() {
									if (roles !== 'ROLE_EMPLOYEE') {
										Router.pushRoute('/');
									}
								}
							});
							this.setState({
								loading: false
							});
						}

						if (res.statusCode && res.statusCode === 400) {
							setFields({
								pinCode: {
									//value: values.status,
									errors: [new Error(res.message || '')]
								}
							});
							this.setState({
								loading: false
							});
						}
					},
					() => {
						this.setState({
							loading: false
						});
					}
				);
			}
		});
	};

	render() {
		const { loading } = this.state;
		const { classes } = this.props;
		const { getFieldDecorator } = this.props.form;
		return (
			<Form onSubmit={this.handleSubmit} className="login-form">
				<div className={classes.title}>
					{/* <h3>
						<FormattedMessage id="from.reset.header" defaultMessage="Reset Password" />
					</h3> */}
				</div>
				{/* <FormItem>
					{getFieldDecorator('oldPassword', {
						rules: [
							{
								required: true,
								message: 'Please input your password!'
							}
						]
					})(
						<Input
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							type="oldPassword"
							size="large"
							placeholder="Current password"
						/>
					)}
				</FormItem> */}
				<FormItem>
					{getFieldDecorator('pinCode', {
						rules: [
							{
								required: true,
								message: 'Please input your new pin code!'
							},
							{
								min: 1,
								max: 4,
								message: 'The length of PINcode is 1-4 number characters'
							},
							{
								validator: this.validateToNextPinCode
							}
						]
					})(
						<Input
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							type="password"
							size="large"
							placeholder="PINCode"
						/>
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('confirm', {
						rules: [
							{
								required: true,
								message: 'Please confirm your new pin code!'
							},
							{
								min: 1,
								max: 4,
								message: 'The length of PINcode is 1-4 number characters'
							},
							{
								validator: this.compareToFirstPinCode
							}
						]
					})(
						<Input
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							type="password"
							size="large"
							placeholder="Confirm new PINCode"
						/>
					)}
				</FormItem>
				<FormItem>
					<Button
						type="primary"
						size="large"
						htmlType="submit"
						className={classes.btnLogin}
						loading={loading}>
						Change
					</Button>
				</FormItem>
			</Form>
		);
	}
}
