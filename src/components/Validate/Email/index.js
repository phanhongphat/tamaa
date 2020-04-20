import React, { PureComponent } from 'react';
import { Form, Input, Typography } from 'antd';

import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

const { Text } = Typography;

export default class Email extends PureComponent {
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
			<div style={{ position: 'relative', marginBottom: '60px' }}>
				<Form.Item
					hasFeedback
					{...formItemLayout}
					labelAlign="left"
					label={this.props.name}
					// help={
					// 	<FormattedMessage
					// 		id="createEmail.note"
					// 		defaultMessage="Email password will be automatically generated and sent the company's email when the account is created"
					// 	/>
					// }
				>
					{getFieldDecorator(this.props.stateName, {
						rules: [
							this.props.stateName == 'email' && {
								type: 'email',
								//message: `The input is not valid ${this.props.stateName}!`
								message: (
									<FormattedMessage
										id="companies.create.invalidFormat"
										defaultMessage="Invalid email format"
									/>
								)
							},
							{
								required: true,
								message: `S'il vous plaît entrer votre ${this.props.name}!`
							}
						]
					})(<Input onChange={this.handleChange} placeholder={this.props.name} />)}
				</Form.Item>
				<Text type="secondary" style={{ position: 'absolute', top: 60, right: '35px', marginLeft: '25%' }}>
					<FormattedMessage
						id="createEmail.note"
						defaultMessage="Email password will be automatically generated and sent the company's email when the account is created"
					/>
				</Text>
			</div>
		);
	}
}
