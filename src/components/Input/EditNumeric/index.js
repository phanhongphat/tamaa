import React, { PureComponent } from 'react';

import injectSheet from 'react-jss';
import { Form, Input, Button, Typography, Row, Col, message } from 'antd';
import styles from './styles';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

import NumericInput from 'src/components/Input/NumericInput';

const { Text } = Typography;

function numberWithSpaces(x) {
	return x.toString().replace(/^(.{4})(.{2})(.{3})(.*)$/, '$1 $2 $3 $4');
}

@injectSheet(styles)
@Form.create()
export default class FieldNumericEditor extends PureComponent {
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

	onChange = value => {
		const { name, addonBefore, output } = this.props;
		if (!addonBefore && output === 'number') value = parseFloat(value);
		// this.props.onChange(value);
		this.setState({
			[name]: addonBefore && value ? addonBefore + value : value
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
		const { name, value, addonBefore, rules } = this.props;
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
									}}
									labelAlign="left">
									{getFieldDecorator(name, {
										initialValue: addonBefore ? value.slice(addonBefore.length) : value,
										rules
									})(<NumericInput {...this.props} onChange={this.onChange} />)}
								</Form.Item>
							</Form>
						</Col>
						<Col>
							<Row type="flex" style={{ marginTop: '5px' }}>
								<Button.Group>
									<Button
										style={{ border: '1px solid lightgrey' }}
										onClick={() => {
											this.setState({
												editEnable: false
											});
											this.handelCancel(name);
											// console.log('Cancel', this.state.fieldInfo);
										}}>
										{' '}
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
						{/*<Row style={{marginRight: '5px'}}><h4>{name}:</h4> </Row>*/}
						<Row style={{ display: 'flex', alignContent: 'center' }}>
							<Col span={20} style={{ marginTop: '7px' }}>
								<Text style={{ marginTop: '6px', wordBreak: 'break-word' }}>
									{value
										? name === 'phoneNumber1' || name === 'phoneNumber2'
											? numberWithSpaces(value)
											: value
										: 'Néant'}
								</Text>
							</Col>
							<Col xl={4}>
								<Button
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
