import React, { PureComponent } from 'react';
import { Form, Input, Row, Col } from 'antd';

import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
export default class Phone extends PureComponent {
	state = {
		isNumber: /^\d+$/,
		isLength: /\b\d{7,9}\b/
	};

	handlePhoneNumberChange = (rule, value, callback) => {
		const { onChange, stateName, form } = this.props;
		const { isNumber, isLength } = this.state;

		if (!isLength.test(value)) {
			callback('Le numéro de téléphone doit contenir entre 10 et 12 chiffres en comptant le préfixe ');
			onChange(stateName, undefined);
			// onGetStateChange(stateName, undefined);
		} else if (value < 0) {
			callback('Value is negative');
			onChange(stateName, undefined);
		} else {
			callback();
		}
	};

	handleChange = e => {
		this.props.onChange(this.props.stateName, e.target.value === '' ? null : `689${e.target.value}`);
	};
	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 24 },
				md: { span: 6 }
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 24 },
				md: { span: 18 }
			}
		};

		const rule = [{ validator: this.handlePhoneNumberChange }];
		if (this.props.name === 'Numéro de téléphone 2') {
			return (
				<Row>
					<Col span={6}></Col>
					<Col xs={24} sm={24} md={18}>
						<Form.Item labelAlign="left" hasFeedback>
							{getFieldDecorator(this.props.stateName, {
								rules: this.props.validation && rule
							})(<Input addonBefore="+689" onChange={this.handleChange} placeholder={this.props.name} />)}
						</Form.Item>
					</Col>
				</Row>
			);
		} else {
			return (
				<Form.Item {...formItemLayout} labelAlign="left" label={this.props.name} hasFeedback>
					{getFieldDecorator(this.props.stateName, {
						rules: rule
					})(<Input addonBefore="+689" onChange={this.handleChange} placeholder={this.props.name} />)}
				</Form.Item>
			);
		}
	}
}
