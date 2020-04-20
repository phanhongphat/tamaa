import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import injectSheet from 'react-jss';
import { Form, Icon, Input, Button, Checkbox } from 'antd';
import { Router } from 'src/routes';

import { registerRequest } from 'src/redux/actions/auth';
import AuthStorage from 'src/utils/AuthStorage';
import styles from './styles';

const FormItem = Form.Item;

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
				registerRequest
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
			registerRequest: PropTypes.func.isRequired
		}).isRequired
	};

	static defaultProps = {};

	state = {
		loading: true
	};

	componentDidMount() {
		if (AuthStorage.loggedIn && this.props.store.auth.id) {
			Router.pushRoute('/');
		}
	}

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
				this.setState({
					loading: true
				});
				this.props.action.registerRequest(
					values,
					() => {
						Router.pushRoute('/');

						this.setState({
							loading: false
						});
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

	checkLength = (rule, value, callback) => {
		const { form } = this.props;
		if (value.length < 8) {
			callback('It must be between 8 - 12 characters long.');
		}
	};

	render() {
		const { loading } = this.state;
		const { classes } = this.props;
		const { getFieldDecorator } = this.props.form;
		return (
			<Form onSubmit={this.handleSubmit} className="login-form">
				<FormItem>
					{getFieldDecorator('username', {
						rules: [{ required: true, message: 'Please input your username!' }]
					})(
						<Input
							prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="username"
						/>
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('email', {
						rules: [{ required: true, message: 'Please input your email!' }]
					})(
						<Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="email" />
					)}
				</FormItem>
				<FormItem>
					{getFieldDecorator('password', {
						rules: [
							{ required: true, message: 'Please input your Password!' },
							{
								validator: this.checkLength
							}
						]
					})(
						<Input
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							type="password"
							placeholder="Nouveau mot de passe"
						/>
					)}
				</FormItem>
				<FormItem>
					{/* {getFieldDecorator('remember', {
						valuePropName: 'checked',
						initialValue: true
					})(<Checkbox>Remember me</Checkbox>)}
					<a className="login-form-forgot" href="">
						Forgot password
					</a> */}
					<Button type="primary" htmlType="submit" className={classes.btnLogin}>
						Register now
					</Button>
				</FormItem>
			</Form>
		);
	}
}
