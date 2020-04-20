import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';

export default class NumberInput extends PureComponent {
	state = {
		isNumber: /^\d+$/,
		balance: 0
	};

	handlePhoneNumberChange = (rule, value, callback) => {
		const { onChange, stateName, form } = this.props;
		const { isNumber } = this.state;

		if (stateName !== 'dailyAmount' ? !isNumber.test(value) && value.length > 0 : !isNumber.test(value)) {
			callback('Nombre seulement');
			onChange(stateName, undefined);
		} else {
			callback();
		}
	};

	handleChange = e => {
		this.setState({ [this.props.stateName]: e.target.value });
		this.props.onChange(this.props.stateName, `${e.target.value}`);
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const { defaultVal, value } = this.props;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 24 },
				md: { span: 8 },
				lg: { span: 24 },
				xl: { span: 24 }
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 24 },
				md: { span: 24 }
			}
		};
		// console.log(defaultVal);
		return (
			<Form.Item {...formItemLayout} label={this.props.name} style={{ lineHeight: 0 }} hasFeedback>
				{getFieldDecorator(this.props.stateName, {
					rules: [{ validator: this.handlePhoneNumberChange }]
				})(
					<>
						<Input
							value={value === 0 ? null : this.state.balance}
							autoFocus
							onChange={this.handleChange}
							placeholder={defaultVal || this.props.name}
						/>
						{this.props.status && (
							<span style={{ color: 'red', lineHeight: '20px' }}>{this.props.status}</span>
						)}
					</>
				)}
			</Form.Item>
		);
	}
}
