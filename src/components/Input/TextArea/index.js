import React, { PureComponent } from 'react';

import injectSheet from 'react-jss';
import { Form, Input, Button, Typography, Row, Col } from 'antd';
import styles from './styles';
import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

const { Text } = Typography;
const { TextArea } = Input;

@injectSheet(styles)
@Form.create()
export default class TextAreaEditor extends PureComponent {
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
		console.log(name, this.state[name]);
		this.props.handleSave(name, this.state[name]);
	};

	handelCancel = name => {
		const { value } = this.props;
		this.setState({
			[name]: value
		});
	};

	render() {
		const { name, value } = this.props;
		return (
			<div>
				{this.state.editEnable ? (
					// <Input.Group compact>
					<Row>
						<Col span={24} lag={24} vl={16}>
							<TextArea
								rows={4}
								name={name}
								defaultValue={value}
								style={{ width: this.state.inputWidth }}
								onChange={e => {
									console.log(e.target.value);
									this.onChange(e);
								}}
							/>
						</Col>
						<Col span={24} lg={24} xl={8}>
							<Row>
								<Button.Group>
									<Button
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
									{' '}
									<Button
										// type="ghost"
										style={{border: '1px solid lightgrey'}}
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
								<Col span={20}><Text style={{ marginTop: '6px', wordWrap: 'break-word' }}>{value}</Text></Col>
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
