import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import injectSheet from 'react-jss';
import { Form, Input, Button, Modal } from 'antd';
import { Router, Link } from 'src/routes';

import AuthStorage from 'src/utils/AuthStorage';
import styles from './styles';

const FormItem = Form.Item;

//redux
import { forgotPasswordRequest } from 'src/redux/actions/auth';
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
				forgotPasswordRequest
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
export default class ForgotPasswordFrom extends PureComponent {
	static propTypes = {
		store: PropTypes.shape({
			auth: PropTypes.object.isRequired
		}).isRequired,
		action: PropTypes.shape({
			forgotPasswordRequest: PropTypes.func.isRequired
		}).isRequired
	};

	static defaultProps = {};

	state = {
		visible: false,
		loading: false
	};

	componentDidMount() {
		if (AuthStorage.loggedIn && this.props.store.auth.id) {
			Router.pushRoute('/');
		}
	}

	showModal = () => {
		this.setState({
			visible: true
		});
	};

	handleCancel = e => {
		this.setState({
			visible: false
		});
	};

	handleSubmit = e => {
		e.preventDefault();
		const { setFields } = this.props.form;

		this.props.form.validateFields((err, values) => {
			if (!err) {
				this.setState({
					loading: true
				});
				this.props.action.forgotPasswordRequest(
					values,
					() => {
						const { error } = this.props.store.auth;
						console.log('error ==>', error);
						if (error.statusCode === 400) {
							setFields({
								email: {
									value: values.email,
									errors: [new Error(error.message || '')]
								}
							});
						} else {
							this.showModal();
						}

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

	render() {
		const { loading } = this.state;
		const { classes } = this.props;
		const { getFieldDecorator } = this.props.form;
		return (
			<Form onSubmit={this.handleSubmit} className="login-form">
				<Modal visible={this.state.visible} footer={null} closable onCancel={this.handleCancel}>
					<p>
						<strong>L'email a bien été envoyé.</strong>
					</p>
					<p>Un lien de réinitialisation de votre mot de passe vous ont été envoyés par e-mail. </p>
					<p>Merci de suivre les instructions envoyées par email pour réinitialiser votre mot de passe.</p>
					<p>Email non reçu ?</p>
					<Button type="link" onClick={this.handleSubmit}>
						Renvoyer l'email d'authentification
					</Button>
				</Modal>

				<div className={classes.titeHeade}>
					<h3>Mot de passe oublié?</h3>
				</div>
				<FormItem label="Email">
					{getFieldDecorator('email', {
						rules: [{ required: true, message: 'Required field' }]
					})(<Input placeholder="Email" size="large" />)}
				</FormItem>
				<FormItem>
					<div className={classes.wrapButton}>
						<Button size="large" onClick={() => Router.pushRoute('/login')}>
							Retour
						</Button>
						<Button
							type="primary"
							size="large"
							htmlType="submit"
							loading={loading}
							style={{
								float: 'right'
							}}>
							Valider
						</Button>
					</div>
				</FormItem>
			</Form>
		);
	}
}
