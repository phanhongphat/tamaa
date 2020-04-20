import React, { PureComponent } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import injectSheet from 'react-jss';
import { Form, message, Input, Button } from 'antd';
const { TextArea } = Input;

import AuthStorage from 'src/utils/AuthStorage';
import styles from './styles';

import { FormattedMessage } from 'react-intl';
import { pushNotificationRequest } from 'src/redux/actions/restaurant';

function mapStateToProps(state) {
	return {
		store: {
			// restaurant: state.restaurant
		}
	};
}

const mapDispatchToProps = dispatch => {
	return {
		action: bindActionCreators(
			{
				pushNotificationRequest
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
@Form.create()
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

	handleSubmit = e => {
		e.preventDefault();
		this.setState({ loading: true });
		const { restaurantId } = this.props;

		this.props.form.validateFields((err, values) => {
			if (!values.message) this.setState({ loading: false });
			if (!err) {
				console.log('Received values of form: ', values);
				const payload = {
					message: values.message,
					restaurantId
				};
				this.props.action.pushNotificationRequest(
					payload,
					rep => {
						this.props.form.resetFields();
						this.setState({ loading: false }, () => message.success('Push notification success'));
					},
					() => {
						message.error('This is an error message');
						this.setState({ loading: false });
					}
				);
			}
		});
	};

	render() {
		const { loading } = this.state;

		const { classes, details } = this.props;
		const { getFieldDecorator } = this.props.form;

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

		const tailFormItemLayout = {
			wrapperCol: {
				xs: {
					span: 24,
					offset: 0
				},
				sm: {
					span: 20,
					offset: 2
				}
			}
		};

		return (
			<Form {...formItemLayout} onSubmit={this.handleSubmit}>
				<Form.Item
					label={<FormattedMessage id="restaurants.notfication.label.send" defaultMessage="Message" />}>
					{getFieldDecorator('message', {
						rules: [
							{ required: true, message: 'Please input your messager!' },
							{ max: 178, message: 'Maximum characters is 178, please short your message!' }
						]
					})(
						<TextArea
						// placeholder="Some"
						// style={{ maxWidth: '350px' }}
						// autosize={{ minRows: 2, maxRows: 6 }}
						/>
					)}
				</Form.Item>
				<Form.Item {...tailFormItemLayout}>
					<Button type="primary" htmlType="submit" loading={loading}>
						<FormattedMessage id="restaurants.notfication.btn.send" defaultMessage="Émetteur" />
					</Button>
				</Form.Item>
			</Form>
		);
	}
}
