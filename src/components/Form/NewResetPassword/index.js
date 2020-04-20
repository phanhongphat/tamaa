import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { Form, Icon, Input, Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import { Link, Router } from 'routes';

import { resetFirstPasswordRequest } from 'src/redux/actions/auth';
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
				resetFirstPasswordRequest
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
export default class ChangePasswordFrom extends PureComponent {
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

	compareToFirstPassword = (rule, value, callback) => {
		const { form } = this.props;
		if (value && value !== form.getFieldValue('password')) {
			callback('Two passwords that you enter is inconsistent!');
		} else {
			callback();
		}
	};

	validateToNextPassword = (rule, value, callback) => {
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
		const { token, roles } = this.props;

		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({
					loading: true
				});
				const payload = {
					params: {
						token,
						new_password: values.password,
						confirm_password: values.password
					}
				};

				if (token && token !== '') {
					payload.opt = {
						headers: {
							Authorization: `Bearer ${token}`
						}
					};
				}
				this.props.action.resetFirstPasswordRequest(
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
								password: {
									value: values.password,
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
					{getFieldDecorator('password', {
						rules: [
							{
								required: true,
								message: 'Please input your password!'
							},
							{
								validator: this.validateToNextPassword
							}
						]
					})(
						<Input
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							type="password"
							size="large"
							placeholder="Nouveau mot de passe"
						/>
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('confirm', {
						rules: [
							{
								required: true,
								message: 'Please confirm your password!'
							},
							{
								validator: this.compareToFirstPassword
							}
						]
					})(
						<Input
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							type="password"
							size="large"
							placeholder="Confim new password"
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
