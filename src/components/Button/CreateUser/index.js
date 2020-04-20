import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';
import { Modal, Button, Icon, Input, Form, message } from 'antd';
import { FormattedMessage } from 'react-intl';

//redux,
import { createUserRequest } from 'src/redux/actions/user';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import CreateUser from 'src/components/Form/CreateUser';

import styles from './styles';

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
                createUserRequest
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
export default class BtnChangePassword extends PureComponent {
    state = {
        visible: false,
        loading: false
    };

    showModal = () => {
        this.setState({
            visible: true
        });
    };

    // handleOk = e => {
    //     this.setState({
    //         visible: false
    //     });
    // };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    };

    handleCancel = e => {
        this.setState({
            visible: false
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        // const { setFields } = this.props.form;
        const { getListUser } = this.props;

        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                });
                // console.log('values ===>', values);

                const payload = {
                    email: values.email,
                    roles: ['ROLE_TAMAA'],
                    password: values.password,
                    firstName: values.firstName,
                    lastName: values.lastName
                };
                // console.log(payload);
                this.props.action.createUserRequest(
                    payload,
                    (res) => {
                        if (res.id) {
                            message.success('Create user success');
                            getListUser();
                            this.setState({
                                visible: false,
                                loading: false
                            });
                        } else {
                            message.error(res.violations.message);
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
        const { classes } = this.props;
        const { getFieldDecorator, resetFields } = this.props.form;

        return (
            <>
                <Button type="link" icon="plus" onClick={this.showModal}>
                    <FormattedMessage id="btn.create.user" defaultMessage="Créer un utilisateur"/>
                    {/* <Icon type="plus" /> */}
                </Button>

                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Modal
                        title={
                            <FormattedMessage
                                id="btn.create.user"
                                defaultMessage="Créer un utilisateur"/>
                        }
                        visible={this.state.visible}
                        footer={[
                            <Button
                                // size="large"
                                onClick={() => {
                                    resetFields();
                                    this.handleCancel();
                                }}>
                                <FormattedMessage
                                    id="form.create.btn.cancel"
                                    defaultMessage="Cancel"/>
                            </Button>,
                            <Button
                                type="primary"
                                // size="large"
                                htmlType="submit"
                                onClick={this.handleSubmit}
                                loading={this.state.loading}
                                style={{
                                    float: 'right'
                                }}>
                                <FormattedMessage
                                    id="form.create.btn.create"
                                    defaultMessage="Create"/>
                            </Button>
                        ]}
                        onOk={this.handleSubmit}
                        onCancel={this.handleCancel}
                        destroyOnClose>
                        <div>
                            {/*<CreateUser handleCancel={this.handleCancel} getListUser={this.props.getListUser} />*/}
                            <Form.Item label={<FormattedMessage id="form.create.input.email"
                                                                defaultMessage="Email"/>}>
                                {getFieldDecorator('email', {
                                    rules: [{ required: true, message: 'Required field' }]
                                })(<Input placeholder="Email" size="large" autoComplete={false}/>)}
                            </Form.Item>
                            {/* <Form.Item> */}
                            <Form.Item label={<FormattedMessage id="form.create.input.firstName"
                                                                defaultMessage="First Name"/>}>
                                {getFieldDecorator('firstName', {
                                    rules: [{ required: true, message: 'Required field' }]
                                })(<Input size="large" autoComplete={false}/>)}
                            </Form.Item>
                            <Form.Item label={<FormattedMessage id="form.create.input.lastName"
                                                                defaultMessage="Last Name"/>}>
                                {getFieldDecorator('lastName', {
                                    rules: [{ required: true, message: 'Required field' }]
                                })(<Input size="large" autoComplete={false}/>)}
                            </Form.Item>
                            {/*<FormattedMessage*/}
                            {/*	id="form.create.user.role.pass"*/}
                            {/*	defaultMessage="A strong password is combination of letters and punctuation. It must be between 8 - 12 characters*/}
                            {/*	long."*/}
                            {/*/>*/}
                            {/* </Form.Item> */}
                            <Form.Item
                                label={
                                    <FormattedMessage
                                        id="form.create.input.password"
                                        defaultMessage="Password"/>}
                                // hasFeedback
                                >
                                {getFieldDecorator('password', {
                                    rules: [
                                        {
                                            required: true,
                                            message: 'Please input your password!'
                                        },
                                        {
                                            min: 8,
                                            max: 12,
                                            message: (
                                                <FormattedMessage
                                                    id="form.create.user.noti.pass"
                                                    defaultMessage="A strong password is combination of letters and punctuation.
                                                    It must be between 8 - 12 characters long."
                                                />
                                            )
                                        },
                                        {
                                            validator: this.validateToNextPassword
                                        }
                                    ]
                                })(<Input.Password/>)}
                            </Form.Item>
                            <Form.Item
                                label={
                                    <FormattedMessage
                                        id="form.create.input.confirm"
                                        defaultMessage="Confirmer le mot de passe"/>
                                }
                                // hasFeedback
                                >
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
                                })(<Input.Password/>)}
                            </Form.Item>
                        </div>
                    </Modal>
                </Form>
            </>
        );
    }
}
