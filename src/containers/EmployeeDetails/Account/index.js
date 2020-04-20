import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AuthStorage from 'src/utils/AuthStorage';
import injectSheet from 'react-jss';
import _ from 'lodash';
import { Button, message, Switch, Typography, Modal, Row, Col } from 'antd';

import { editEmployeeRequest, getEmployeeDetails } from 'src/redux/actions/employee';
import { updateUserInfor } from 'src/redux/actions/user.js';
import { resetPassword } from 'src/redux/actions/resetPassword';
import styles from './styles';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import SampleButton from 'src/containers/CompanyDetail/Credits/CreditConditions/NormalDay/button';
import Edit from 'src/components/Input/Edit';

const { confirm } = Modal;

const { Text, Title } = Typography;

function mapStateToProps(state) {
	return {
		store: {
			user: state.employees.detail
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				editEmployeeRequest,
				updateUserInfor,
				getEmployeeDetails,
				resetPassword
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
export default class EmployeeTransactionsContainer extends PureComponent {
	static propTypes = {
		classes: PropTypes.object.isRequired,
		store: PropTypes.shape({
			user: PropTypes.object.isRequired
		}),
		action: PropTypes.shape({
			getListEmployee: PropTypes.func.isRequired
		})
	};

	static defaultProps = {};

	state = {
		loading: true,
		isClickedFilter: false,
		visible: false,
		value: '',
		activated: false,
		creditActivated: false,
		confirmLoading: false,
		id: 0,
		idUser: 0
	};

	componentDidMount() {
		this.setState({
			creditActivated: this.props.user.data.user.creditActivated,
			activated: this.props.user.data.user.activated,
			loading: false,
			id: this.props.user.data.id,
			idUser: this.props.user.data.user.id
		});
	}

	getDetailEmployee = id => {
		const payload = {
			id
		};

		this.props.action.getEmployeeDetails(
			payload,
			() => {
				this.setState({
					creditActivated: this.props.user.data.user.creditActivated,
					activated: this.props.user.data.user.activated,
					loading: false
				});
			},
			() => {
				this.setState({ loading: false });
			}
		);
	};
	success = () => {
		const { activated } = this.state;
		console.log(activated);
		const status =
			activated === true ? (
				<FormattedMessage id="activateNow" defaultMessage="Employee is active now" />
			) : (
				<FormattedMessage id="disactiveNow" defaultMessage="Employee is deactivated now" />
			);
		message.success(status);
	};
	handelUpdateEmployees = (payload = {}) => {
		this.props.action.editEmployeeRequest(
			payload,
			() => {
				this.setState({ loading: false });
				this.success();
			},
			() => {
				this.setState({ loading: false });
			}
		);
	};
	handelUpdateUser = (payload = {}) => {
		const id = this.props.user.data.id;
		this.props.action.updateUserInfor(
			payload,
			next => {
				this.setState({
					creditActivated: next.creditActivated,
					activated: next.activated,
					loading: false
				});
				this.props.handelGetEmployeeDetail(id);
				this.success();
			},
			() => {
				this.setState({ loading: false });
			}
		);
	};

	onChangeSwitcher = () => {
		const { data } = this.props.user;
		const idUser = this.state.idUser;
		const seft = this;
		if (data && data.id) {
			const payload = {
				id: idUser,
				activated: !data.user.activated,
				creditActivated: !data.user.creditActivated
			};
			const status = !data.user.activated ? 'activer' : 'désactiver';
			confirm({
				title: `Confirmez-vous la ${status} des éléments sélectionnés?`,
				content: 'Lorsque vous cliquez sur le bouton OK, cette boîte de dialogue sera fermée après 1 seconde',
				onOk() {
					seft.handelUpdateUser(payload);
				},
				onCancel() {
					//seft.getDetailEmployee(data.id);
				}
			});
		}
	};

	handleCancel = () => {
		this.setState({
			visible: false
		});
	};

	handleResetPassword = () => {
		this.setState({
			confirmLoading: true
		});
		this.props.action.resetPassword(
			{
				email: this.props.user.data.email
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

	onChange(e) {
		const target = e.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		this.setState({ [name]: value });
	}

	handleCompanyUpdate = (name, value) => {
		const { id } = this.props.user.data;
		const payload = {
			id,
			[name]: value
		};
		this.props.action.editEmployeeRequest(
			payload,
			() => {
				this.setState({ loading: false });
				if (typeof handleCancel === 'function') handleCancel();
				message.success('Update company name success');
				this.props.handelGetEmployeeDetail(id);
			},
			() => this.setState({ loading: false })
		);
	};

	render() {
		const {
			classes,
			store: { user = {} }
		} = this.props;
		const userClone = this.props.user;
		const { data } = userClone;
		const { creditActivated, activated } = data.user;
		const { email } = this.props.user.data;
		const { confirmLoading } = this.state;
		const { isTama } = AuthStorage;
		console.log(this.props);
		return (
			<div style={{ padding: '10px 20px' }}>
				<Row>
					<Col span={5}>
						<Title level={4}>Statut</Title>
					</Col>
					<Row style={{ float: 'right' }}>
						<Col span={12}>
							<Switch
								checked={activated}
								loading={false}
								defaultChecked={activated}
								onChange={() => this.onChangeSwitcher()}
							/>
							&nbsp;
							{activated === true && activated !== undefined ? (
								<Text>Activé</Text>
							) : (
								<Text>Deactivé</Text>
							)}
						</Col>
					</Row>
				</Row>
				<Row>
					<Col span={3} style={{ paddingTop: '5px' }}>
						Email
					</Col>
					<Col span={10}>
						<Edit
							value={email || ''}
							name="email"
							onChange={this.onChange}
							handleSave={this.handleCompanyUpdate}
						/>
					</Col>
				</Row>
				<div>
					<Button
						style={{ marginTop: '10px' }}
						type="danger"
						icon={confirmLoading ? 'loading' : ''}
						disabled={confirmLoading}
						// onClick={() => this.setState({ isShow: true })}
						onClick={() =>
							confirm({
								title: 'Confirmer',
								content: 'Are you sure you want to reset password of this account?',
								onOk: () => this.handleResetPassword(),
								okText: 'Sauvegarder',
								onCancel() {},
								cancelText: 'Annuler'
							})
						}>
						{/* Réinitialiser le mot de passe */}
						<FormattedMessage id="resetPassword" defaultMessage="Reset password" />
					</Button>

					<Modal
						visible={this.state.visible}
						onCancel={this.handleCancel}
						footer={
							<div style={{ textAlign: 'left', padding: '0 8px' }}>
								<div>
									<FormattedMessage id="notReceiveEmail" defaultMessage="Can not find the email?" />
								</div>
								<Button
									type="link"
									style={{ padding: 0 }}
									// icon="sync"
									onClick={() => this.handleResetPassword()}>
									<FormattedMessage id="resendEmail" defaultMessage="Resend authentication email" />
								</Button>
							</div>
						}>
						<Title level={4}>
							<FormattedMessage id="sentEmail" defaultMessage="Email has been sent" />
						</Title>
						<div>
							<FormattedMessage
								id="announceSentEmail"
								defaultMessage="Email to reset password has been send to your account"
							/>
						</div>
						<div>
							<FormattedMessage
								id="structureResetEmail"
								defaultMessage="Please follow the instruction in the email to reset your password. If you do not receive the email, check your spam box"
							/>
						</div>
					</Modal>
				</div>
			</div>
		);
	}
}
