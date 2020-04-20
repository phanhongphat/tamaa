import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';

const { TextArea } = Input;

export default class TextInput extends PureComponent {
	handleChange = e => {
		this.props.onChange(this.props.stateName, e.target.value);
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
		return (
			<Form.Item
				{...formItemLayout}
				hasFeedback
				labelAlign="left"
				label={this.props.stateName !== 'note1' || this.props.stateName !== 'note2' ? this.props.name : ''}>
				{getFieldDecorator(this.props.stateName, {
					rules: [
						this.props.validate
							? {
									required: true,
									message: `S'il vous plaît entrer votre ${this.props.name}!`
							  }
							: {}
					]
				})(
					this.props.area === '1' ? (
						<Input onChange={this.handleChange} placeholder={this.props.name} />
					) : (
						<TextArea onChange={this.handleChange} placeholder={this.props.name} rows={5} />
					)
				)}
			</Form.Item>
		);
	}
}
