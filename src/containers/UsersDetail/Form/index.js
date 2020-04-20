import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import injectSheet from 'react-jss';
import {
    Form,
    Input,
    Button,
    Spin,
    message,
    Modal,
    Typography
} from 'antd';
import { Router, Link } from 'src/routes';
import { FormattedMessage } from 'react-intl';

// import AuthStorage from 'src/utils/AuthStorage';
import styles from './styles';

const { Title, Paragraph, Text } = Typography;
const FormItem = Form.Item;
const { confirm } = Modal;

import Edit from 'src/components/Input/Edit';

//redux,
import { updateUserInfor } from 'src/redux/actions/user';
import { resetPassword } from 'src/redux/actions/resetPassword';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function mapStateToProps(state) {
	return {
		store: {
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
export default class FromUserDetail extends PureComponent {
	static propTypes = {
		store: PropTypes.shape({
			user: PropTypes.object.isRequired
		}).isRequired,
		action: PropTypes.shape({
			createUserRequest: PropTypes.func.isRequired
		}).isRequired
	};

	static defaultProps = {};

	state = {
		loading: false,
        confirmLoading: false,
		email: '',
		username: ''
	};

	onChange = event => {
		const target = event.target;
		// console.log('onChange', target);
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	};

	handleSubmit = e => {
		// console.log('handleSubmit');
	};

	handelUpdateUser = (name, value) => {
		// e.preventDefault();
		// console.log('handelUpdateUser', name, value);
		const {
			store: {
				user: {
					detail: { data = {} }
				}
			}
		} = this.props;

		const payload = {
			id: data.id,
			[name]: value
		};

		this.props.action.updateUserInfor(
			payload,
			() => {
				this.setState({
					loading: false
				});

				if (typeof handleCancel === 'function') {
					handleCancel();
				}

				//show message
				message.success(`Mise à jour le succès de l'utilisateur`);
			},
			() => {
				this.setState({
					loading: false
				});
			}
		);
	};

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
                email: this.props.store.user.detail.data.email
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

	render() {
        const { loading, confirmLoading } = this.state;
		const {
			classes,
			store: {
				user: {
					detail: { data = {} }
				}
			}
		} = this.props;
		const { getFieldDecorator } = this.props.form;

		// console.log('user detail', data);

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 2 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 10 }
            }
        };

		return (
			<Form {...formItemLayout} onSubmit={this.handleSubmit}>
				<FormItem label="E-mail" labelAlign="left">
					{/* <Edit
						value={data.email || ''}
						name="email"
						onChange={this.onChange}
						handleSave={this.handelUpdateUser}
					/> */}
					{data.email}
				</FormItem>
				<FormItem
					label={<FormattedMessage id="user.table.colum.firstName" defaultMessage="First Name" />}
					labelAlign="left">
					<Edit
						value={data.firstName || ''}
						name="firstName"
						onChange={this.onChange}
						handleSave={this.handelUpdateUser}
					/>
				</FormItem>
				<FormItem
					label={<FormattedMessage id="user.table.colum.lastName" defaultMessage="Last Name" />}
					labelAlign="left">
					<Edit
						value={data.lastName || ''}
						name="lastName"
						onChange={this.onChange}
						handleSave={this.handelUpdateUser}
					/>
				</FormItem>
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
                                    'Êtes-vous sûr de vouloir réinitialiser le mot de passe de la utilisateur',
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
			</Form>
		);
	}
}
