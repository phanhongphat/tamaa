import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Router, Link } from 'src/routes';
import injectSheet from 'react-jss';
import { Form, Icon, Input, Button, Row, Col } from 'antd';
import { FormattedMessage } from 'react-intl';

import { loginRequest } from 'src/redux/actions/auth';
import AuthStorage from 'src/utils/AuthStorage';
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
				loginRequest
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
export default class LoginFrom extends PureComponent {
	static propTypes = {
		store: PropTypes.shape({
			auth: PropTypes.object.isRequired
		}).isRequired,
		action: PropTypes.shape({
			loginRequest: PropTypes.func.isRequired
		}).isRequired
	};

	static defaultProps = {};

	state = {
		loading: false
	};

	componentDidMount() {
		if (AuthStorage.loggedIn && this.props.store.auth.id) {
			Router.pushRoute('/');
		}
	}

	handleSubmit = e => {
		e.preventDefault();
		const { setFields } = this.props.form;

		this.props.form.validateFields((err, values) => {
			if (!err) {
				// console.log('Received values of form: ', values);
				this.setState({
					loading: true
				});
				// console.log('handleSubmit ==>', values);
				this.props.action.loginRequest(
					{
						username: values.username.replace(/\s/g, ''),
						password: values.password
					},
					() => {
						// console.log('this.props.auth', this.props.store.auth);
						// console.log('AuthStorage.loggedIn', AuthStorage.loggedIn);
						// if (AuthStorage.loggedIn && this.props.auth.userId) {
						console.log(AuthStorage.loggedIn);
						if (AuthStorage.loggedIn) {
							Router.pushRoute('/companies');
						}

						this.setState({
							loading: false
						});
					},
					() => {
						const { error } = this.props.store.auth;

						if (error.statusCode === 602) {
							setFields({
								username: {
									value: values.username,
									errors: [new Error(error.message || '')]
								}
							});
						}

						if (error.statusCode === 601) {
							setFields({
								password: {
									value: values.password,
									errors: [new Error(error.message || '')]
								}
							});
						}

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
					<h3>
						<FormattedMessage id="from.login.header" defaultMessage="Connexion" />
					</h3>
				</div>
				<FormItem
					label={<FormattedMessage id="from.login.input.username" defaultMessage="Identifiant" />}
					className={classes.input}>
					{getFieldDecorator('username', {
						rules: [{ required: true, message: 'Required field' }]
					})(
						<Input
							// prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="Identifiant"
							size="large"
						/>
					)}
				</FormItem>
				<FormItem
					label={<FormattedMessage id="from.login.input.password" defaultMessage="Mot de passe" />}
					className={classes.input}>
					{getFieldDecorator('password', {
						rules: [{ required: true, message: 'Required field' }]
					})(
						<Input
							// prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							type="password"
							size="large"
							placeholder="Mot de passe"
						/>
					)}
				</FormItem>
				<FormItem>
					<Row type="flex" justify="space-between">
						<Col>
							<Button
								type="primary"
								size="large"
								htmlType="submit"
								className={classes.btnLogin}
								loading={loading}>
								<FormattedMessage id="from.login.btn.submit" defaultMessage="Connexion" />
							</Button>
						</Col>
						<Col>
							<Link to="/forgot-password">
								<a className="login-form-forgot" href="">
									<FormattedMessage
										id="from.login.btn.forgot"
										defaultMessage="Mot de passe oublié ?"
									/>
								</a>
							</Link>
						</Col>
					</Row>
				</FormItem>
			</Form>
		);
	}
}
