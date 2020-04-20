import React, { PureComponent } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import AuthStorage from 'src/utils/AuthStorage';
import { updateUserInfor } from 'src/redux/actions/user';

import QRCode from 'qrcode.react';

import injectSheet from 'react-jss';
import { Form, Typography, Switch, Icon, Button, Modal, Input, Popconfirm, message, Col, Row, Divider } from 'antd';
import { Router, Link } from 'src/routes';

import { loginRequest } from 'src/redux/actions/auth';
import Loading from 'src/components/Loading/index.js';
import styles from './styles';

import FieldEditor from 'src/components/Input/FieldEditor';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import { getListTransactions } from 'src/redux/actions/transactions';
import { getDetailRestaurant, editRestaurant } from 'src/redux/actions/restaurant';
import { resetPassword } from 'src/redux/actions/resetPassword';
import Edit from 'src/components/Input/Edit';

const { Title, Paragraph, Text } = Typography;
const { confirm } = Modal;

function mapStateToProps(state) {
	return {
		store: {
			restaurant: state.restaurant,
			user: state.user
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				updateUserInfor,
				resetPassword,
				getDetailRestaurant,
				editRestaurant
			},
			dispatch
		)
	};
};

@injectSheet(styles)
@Form.create()
@connect(
	mapStateToProps,
	mapDispatchToProps
)
export default class RestaurantAccount extends PureComponent {
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
		loading: false,
		activated: true,
		secondsCountDown: 5,
		visible: false,
		confirmLoading: false
	};

	componentDidMount() {
		// if (AuthStorage.loggedIn && this.props.store.auth.id) {
		//     Router.pushRoute('/');
		// }
	}

	showModal = () => {
		this.setState({
			visible: true
		});
		setTimeout(() => {
			this.setState({
				visible: false,
				confirmLoading: false
			});
		}, this.state.secondsCountDown * 1000);
	};

	handleResetPassword = () => {
		this.setState({
			confirmLoading: true
		});
		this.props.action.resetPassword(
			{
				email: this.props.details.email
			},
			next => {
				this.setState({
					visible: true,
					loading: false,
					confirmLoading: false
				});
			},
			nextErr => this.setState({ loading: false })
		);
	};

	handleCancel = () => {
		this.setState({
			visible: false
		});
	};

	handleActivated = () => {
		const { id, activated } = this.props.details.user;

		const payload = {
			id,
			activated: !activated,
			creditActivated: !activated
		};
		// if (activated) {
		this.props.action.updateUserInfor(
			payload,
			() => {
				this.setState({ loading: false });
				const { user } = this.props.store;
				if (user.detail.data.title !== 'An error occurred') {
					message.success('Mise à jour réussie');
					// message.success(
					//     <FormattedMessage
					//         id="restaurants.account.updateSuccessfully"
					//         defaultMessage="Update data successfully"/>
					// );
					this.props.handleGetRestaurantDetail(this.props.details.id);
				} else {
					message.error('Credit doit être désactivé');
				}
			},
			() => {
				this.setState({ loading: false });
				// message.error('Error');
			}
		);
		// } else message.error('You must activate your account first');
	};

	onChangeSwitcher = () => {
		const self = this;

		const {
			user: { activated, customId }
		} = this.props.details;

		confirm({
			title: 'Confirmer',
			content: `Confirmez-vous ${activated ? 'la désactivation' : "l'activation"} des ce restaurant?`,
			onOk() {
				self.handleActivated();
			},
			okText: 'Qui',
			onCancel() {},
			cancelText: 'Non'
		});
	};

	onChange(e) {
		const target = e.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		this.setState({ [name]: value });
	}

	handleUpdateInformation = (name, value) => {
		const { id } = this.props.details;
		const payload = {
			id,
			[name]: value
		};
		this.props.action.editRestaurant(
			payload,
			next => {
				this.setState({ loading: false });
				if (next.title !== 'An error occurred') {
					message.success('Mise à jour réussie');
					// message.success(
					// 	<FormattedMessage
					// 		id="restaurants.account.updateSuccessfully"
					// 		defaultMessage="Update data successfully"/>
					// );
					this.props.handleGetRestaurantDetail(id);
				} else {
					message.error(next.detail);
				}
			},
			nextErr => this.setState({ loading: false })
		);
	};

	render() {
		const { loading, confirmLoading } = this.state;
		const { classes, details } = this.props;
		const { isTama, isRestaurant } = AuthStorage;

		const {
			user: { activated, customId },
			email
		} = details;

		// if (!loading) {
		//     return <Loading/>;
		// }

		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 2 }
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 }
			}
		};

		return (
			<Form {...formItemLayout}>
				<Row type="flex" justify="space-between" align="middle">
					<Col span={12}>
						<Title level={4}>
							<FormattedMessage
								id="restaurants.account.accountManagement"
								defaultMessage="Account management"
							/>
						</Title>
					</Col>
					<Col span={12}>
						{isTama && (
							<Row type="flex" justify="end" align="middle">
								<Switch
									// disabled={!activated}
									checked={activated}
									defaultChecked={activated}
									onChange={() => this.onChangeSwitcher()}
									className={classes.switcher}
								/>
								<Text strong>
									{activated ? (
										<FormattedMessage
											id="restaurants.account.activated"
											defaultMessage="Activated"
										/>
									) : (
										<FormattedMessage
											id="restaurants.account.deactivated"
											defaultMessage="Deactivated"
										/>
									)}
								</Text>
							</Row>
						)}
					</Col>
				</Row>
				<Form.Item
					label={<FormattedMessage id="restaurants.account.email" defaultMessage="Email" />}
					labelAlign="left">
					<Edit
						value={email}
						name="email"
						rules={[
							{
								type: 'email',
								message: 'The input is not valid E-mail!'
							},
							{
								required: true,
								message: 'Please input your E-mail!'
							}
						]}
						onChange={this.onChange}
						handleSave={this.handleUpdateInformation}
					/>
				</Form.Item>
				{isTama && (
					<div>
						<Button
							type="danger"
							icon={confirmLoading ? 'loading' : ''}
							disabled={confirmLoading}
							// onClick={() => this.setState({ isShow: true })}
							onClick={() =>
								confirm({
									title: 'Confirmer',
									content:
										'Êtes-vous sûr de vouloir réinitialiser le mot de passe de la etablissement',
									onOk: () => this.handleResetPassword(),
									okText: 'Sauvegarder',
									onCancel() {},
									cancelText: 'Annuler'
								})
							}>
							{/* Réinitialiser le mot de passe */}
							<FormattedMessage id="restaurants.account.resetPassword" defaultMessage="Reset password" />
						</Button>
						{/* <Popconfirm
                            disabled={confirmLoading}
                            placement="bottom"
                            title={
                                <Text>
                                    <FormattedMessage
                                        id="restaurants.account.resetPassword.confirm.content"
                                        defaultMessage="Are you sure you want to reset password of restaurant"
                                    />
                                    {' #' + customId + '?'}
                                </Text>
                            }
                            onConfirm={this.handleResetPassword}
                            okText={
                                <FormattedMessage
                                    id="restaurants.account.resetPassword.confirm.yes"
                                    defaultMessage="Reset" />}
                            cancelText={
                                <FormattedMessage
                                    id="restaurants.account.resetPassword.confirm.no"
                                    defaultMessage="Cancel" />}
                        >
                            <Button
                                type="danger"
                                icon={confirmLoading ? 'loading' : ''}
                                disabled={confirmLoading}>
                                <FormattedMessage
                                    id="restaurants.account.resetPassword"
                                    defaultMessage="Reset password" />
                            </Button>
                        </Popconfirm> */}
						<Modal
							visible={this.state.visible}
							onCancel={this.handleCancel}
							footer={
								<div style={{ textAlign: 'left', padding: '0 8px' }}>
									<div>
										<FormattedMessage
											id="restaurants.account.resetPassword.result.resendTitle"
											defaultMessage="Can not find the email?"
										/>
									</div>
									<Button
										type="link"
										style={{ padding: 0 }}
										// icon="sync"
										onClick={() => this.handleResetPassword()}>
										<FormattedMessage
											id="restaurants.account.resetPassword.result.resend"
											defaultMessage="Resend authentication email"
										/>
									</Button>
								</div>
							}>
							<Title level={4}>
								<FormattedMessage
									id="restaurants.account.resetPassword.result.title"
									defaultMessage="Email has been sent"
								/>
							</Title>
							<div>
								<FormattedMessage
									id="restaurants.account.resetPassword.result.paragraph1"
									defaultMessage="Email to reset password has been send to your account"
								/>
							</div>
							<div>
								<FormattedMessage
									id="restaurants.account.resetPassword.result.paragraph2"
									defaultMessage="Please follow the instruction in the email to reset your password. If you do not receive the email, check your spam box"
								/>
							</div>
						</Modal>
					</div>
				)}
			</Form>
		);
	}
}
