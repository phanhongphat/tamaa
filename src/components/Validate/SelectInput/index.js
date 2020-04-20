import React, { PureComponent } from 'react';
import { Form, Input, Select } from 'antd';

import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

export default class SelectForm extends PureComponent {
	handleChange = e => {
		this.props.onChange(this.props.stateName, e.target.value);
	};

	onChange(e, name) {
		this.props.callCity(e, name);
		name === 'island' &&
			this.props.form.setFieldsValue({
				city: undefined
			});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { data } = this.props;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 24 },
				md: { span: 13 }
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 24 },
				md: { span: 11 }
			}
		};
		return (
			<Form.Item {...formItemLayout} labelAlign="left" label={this.props.name} hasFeedback>
				{getFieldDecorator(this.props.stateName, {
					// rules: [
					// 	{
					// 		required: true,
					// 		message: `S'il vous plaît entrer votre ${this.props.name}!`
					// 	}
					// ]
				})(
					<Select
						style={{ width: '100%' }}
						onSelect={e => this.onChange(e, this.props.stateName)}
						placeholder={`${this.props.name}`}>
						{data &&
							data.map(d => (
								<Select.Option key={d.id} value={d.id}>
									{d.islandName || d.cityName}
								</Select.Option>
							))}
					</Select>
				)}
			</Form.Item>
		);
	}
}
