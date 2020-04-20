import React, { PureComponent } from 'react';

import injectSheet from 'react-jss';
import { Form, Input, Button, Typography, Row, Col } from 'antd';
import styles from './styles';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

import NumericInput from 'src/components/Input/NumericInput';

const { Text } = Typography;

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
		inputWidth: '400px',
		isSave: true
	};

	componentDidMount() {
		const { name, value } = this.props;
		this.setState({ [name]: value });
	}

	componentWillReceiveProps(nextProps) {
		
		if (nextProps.isSave !== this.props.isSave) {
			this.setState({
				isSave: nextProps.isSave
			});
		}
	}

	onChange = value => {
		const { name, addonBefore, output } = this.props;
		if (!addonBefore && output === 'number') value = parseFloat(value);
		this.props.onChange(value);
		this.setState({
			[name]: addonBefore ? addonBefore + value : value
		});
		//console.log(value);
	};

	handleSave = name => {
		// console.log(name, this.state[name]);
		this.props.handleSave(name, this.state[name]);
	};

	handelCancel = name => {
		const { value } = this.props;
		this.setState({
			[name]: value
		});
	};

	render() {
		const { name, value, addonBefore } = this.props;
		const { getFieldDecorator, getFieldValue } = this.props.form;
		return (
			<div>
				{this.state.editEnable ? (
					// <Input.Group compact>
					<Row type="flex" justify="space-between">
						<Col>
							<Form>
								<Form.Item style={{ width: this.state.inputWidth }} labelAlign="left">
									{getFieldDecorator(name, {
										initialValue: addonBefore ? value.slice(addonBefore.length) : value,
										rules: [
											{
												required: true,
												message: (
													<FormattedMessage
														id="empoloyee.emptyPhoneNumber"
														defaultMessage="Please input your phone number!"
													/>
												)
											},
											{
												min: 7,
												max: 9,
												message:
													'Le numéro de téléphone doit comporter entre 7 et 9 caractères (ne pas inclure +689)'
											}
										]
									})(<NumericInput {...this.props} onChange={this.onChange} />)}
								</Form.Item>
							</Form>
						</Col>
						<Col>
							<Row type="flex">
								<Button.Group>
									<Button
										disabled={!this.props.isSave}
										type="primary"
										htmlType="submit"
										onClick={() => {
											this.setState({
												editEnable: false
											});
											this.handleSave(name);
										}}>
										{this.state.buttonTextSave}
									</Button>
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
									</Button>
								</Button.Group>
							</Row>
						</Col>
					</Row>
				) : (
					// </Input.Group>
					<Input.Group compact>
						<Row style={{ display: 'flex', alignContent: 'center' }}>
							<Col span={20}>
								<Text style={{ marginTop: '6px', wordBreak: 'break-word' }}>{value}</Text>
							</Col>
							<Col span={4}>
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
