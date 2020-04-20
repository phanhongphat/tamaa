import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import injectSheet from 'react-jss';
import { Row, Col, Form, Icon, Input, Button } from 'antd';

import { changePasswordRequest } from 'src/redux/actions/auth';
// import AuthStorage from 'src/utils/AuthStorage';
// import Loading from 'src/components/Loading/index.js';

import styles from './styles';

const FormItem = Form.Item;

//redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FormattedMessage } from 'react-intl';

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
				changePasswordRequest
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
		loading: false,
		confirmDirty: false
	};

	componentDidMount() {
		// if (AuthStorage.loggedIn && this.props.store.auth.id) {
		// 	Router.pushRoute('/');
		// }
	}

	handleConfirmBlur = e => {
		const { value } = e.target;
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	};

	compareToFirstPassword = (rule, value, callback) => {
		const { form } = this.props;
		if (value && value !== form.getFieldValue('password')) {
			callback('La confirmation ne correspond pas au nouveau mot de passe!');
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

	threePasswordsIsSame = (rule, value, callback) => {
		const { form } = this.props;
		if (value && value === form.getFieldValue('oldPassword')) {
			callback(`Votre nouveau mot de passe doit être différent de l'ancien!`);
		} else {
			callback();
		}
	};

	checkLength = (rule, value, callback) => {
		const { form } = this.props;
		if (value.length < 8) {
			callback(`Il doit
			comprendre au moins 8 à 12 caractères.`);
		}
	};

	handleSubmit = e => {
		e.preventDefault();
		const { setFields } = this.props.form;

		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({
					loading: true
				});
				const payload = {
					params: {
						currentPassword: values.oldPassword,
						newPassword: values.password,
						confirmNewPassword: values.password
					}
				};
				this.props.action.changePasswordRequest(
					payload,
					() => {
						console.log('this.props.auth', this.props.store.auth);
						// console.log('AuthStorage.loggedIn', AuthStorage.loggedIn);
						// if (AuthStorage.loggedIn && this.props.auth.userId) {

						const { status } = this.props.store.auth;

						if (status.statusCode === 409) {
							setFields({
								oldPassword: {
									value: values.oldPassword,
									errors: [new Error(status.message || '')]
								}
							});
							this.setState({
								loading: false
							});
						} else if (status.statusCode === 400) {
							setFields({
								password: {
									value: values.password,
									errors: [new Error(status.message || '')]
								}
							});
							this.setState({
								loading: false
							});
						} else {
							this.props.handleCancel();
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
			<Form onSubmit={this.handleSubmit}>
				<FormItem>
					{getFieldDecorator('oldPassword', {
						rules: [
							{
								required: true,
								message: 'Veuillez saisir votre mot de passe!'
							}
							// {
							// 	validator: this.checkLength
							// }
						]
					})(
						<Input
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							type="password"
							// size="large"
							placeholder="Mot de passe actuel"
						/>
					)}
				</FormItem>
				<FormItem style={{ marginBottom: '0' }} hasFeedback>
					{getFieldDecorator('password', {
						rules: [
							{
								validator: this.threePasswordsIsSame
							},
							{
								min: 8,
								max: 12,
								message: (
									<FormattedMessage
										id="form.create.user.noti.pass"
										defaultMessage="A strong password is combination of letters and punctuation. It must be between 8 - 12 characters long."
									/>
								)
							},
							{
								validator: this.validateToNextPassword
							},
							{
								required: true,
								message: 'Veuillez saisir votre mot de passe!'
							}
						]
					})(
						<Input.Password
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							// size="large"
							placeholder="Nouveau mot de passe"
						/>
					)}
				</FormItem>
				<FormItem hasFeedback>
					{getFieldDecorator('confirm', {
						rules: [
							{
								validator: this.compareToFirstPassword
							},
							{
								required: true,
								message: 'Veuillez confirmer votre mot de passe!'
							}
						]
					})(
						<Input.Password
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							// size="large"
							placeholder="Veuillez confirmer votre mot de passe"
							onBlur={this.handleConfirmBlur}
						/>
					)}
				</FormItem>
				<Row type="flex" justify="end" gutter={12}>
					<Col>
						<Button
							type="default"
							// size="large"
							// htmlType="submit"
							onClick={() => this.props.handleCancel()}
							className={classes.btnLogin}>
							Annuler
						</Button>
					</Col>
					<Col>
						<Button
							type="primary"
							// size="large"
							htmlType="submit"
							className={classes.btnLogin}
							loading={loading}>
							Changer
						</Button>
					</Col>
				</Row>
			</Form>
		);
	}
}
