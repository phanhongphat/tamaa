import React, { PureComponent } from 'react';

import injectSheet from 'react-jss';
import { Form, Input, Button, Typography, Row, Col, message, DatePicker } from 'antd';
import styles from './styles';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import moment from 'moment';

const { Text } = Typography;

function numberWithSpaces(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

@injectSheet(styles)
@Form.create()
export default class FieldEditor extends PureComponent {
	state = {
		loading: true,
		editEnable: false,
		fieldInfo: {
			name: 'defaultValue',
			value: 'defaultValue',
			editEnable: false
		},
		buttonTextEdit: <FormattedMessage id="edit" defaultMessage="Edit" />,
		buttonTextSave: <FormattedMessage id="save" defaultMessage="Save" />,
		buttonTextCancel: <FormattedMessage id="cancel" defaultMessage="Cancel" />,
		inputWidth: '400px'
	};

	componentDidMount() {
		const { name, value } = this.props;
		this.setState({ [name]: value });
	}

	onChange = event => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	};

	handleSave = name => {
		// console.log(name, this.state[name]);
		this.props.form.validateFields((err, fieldsValue) => {
			if (!err) {
				this.setState({
					editEnable: false
				});
				this.props.handleSave(name, this.state[name]);
			} else {
				message.error(err);
			}
		});
	};

	handelCancel = name => {
		const { value } = this.props;
		this.setState({
			[name]: value
		});
	};

	render() {
		const { name, value, rules, classes } = this.props;
		const { getFieldDecorator, getFieldValue } = this.props.form;
		return (
			<div style={{ width: this.props.width ? this.props.width : null }}>
				{this.state.editEnable ? (
					// <Input.Group compact>
					<Row type="flex" justify="space-between">
						<Col>
							<Form>
								<Form.Item
									// label={name}
									style={{
										width: this.props.inputWidth ? this.props.inputWidth : this.state.inputWidth
									}}>
									{getFieldDecorator(name, {
										initialValue: value,
										rules
									})(
										<Input
											name={name}
											style={{ width: this.state.inputWidth }}
											onChange={e => {
												// console.log(e.target.value);
												this.onChange(e);
											}}
										/>
									)}
								</Form.Item>
							</Form>
						</Col>
						<Col>
							<Row type="flex">
								<Button.Group className={classes.btnGroup}>
									<Button
										style={{ border: '1px solid lightgrey' }}
										onClick={() => {
											this.setState({
												editEnable: false
											});
											this.handelCancel(name);
											// console.log('Cancel', this.state.fieldInfo);
										}}>
										{this.state.buttonTextCancel}
									</Button>{' '}
									<Button
										type="primary"
										htmlType="submit"
										onClick={() => {
											this.handleSave(name);
										}}>
										{this.state.buttonTextSave}
									</Button>
								</Button.Group>
							</Row>
						</Col>
					</Row>
				) : (
					// </Input.Group>
					<Input.Group compact>
						<Row style={{ display: 'flex', alignContent: 'center' }}>
							<Col span={20} style={{ marginTop: '5px' }}>
								<Text style={{ marginTop: '6px', wordBreak: 'break-word' }}>{value}</Text>
							</Col>
							<Col span={4}>
								<Button
									style={{ color: this.props.color }}
									type="link"
									icon="form"
									onClick={() => {
										this.setState({
											editEnable: true
										});
									}}>
									{this.state.buttonTextEdit}
								</Button>
							</Col>
						</Row>
					</Input.Group>
				)}
			</div>
		);
	}
}
