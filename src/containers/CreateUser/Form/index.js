import {
	Form,
	Icon,
	Input,
	Button,
	Divider,
	Dropdown,
	Select,
	Menu,
	Radio,
	Modal,
	DatePicker,
	Checkbox,
	Row,
	Col
} from 'antd';
import React, { PureComponent, Fragment } from 'react';
import DateSelected from '../DateSelected';
import HeaderContent from '../../../components/HeaderContent';
const { MonthPicker, RangePicker, WeekPicker, TimePicker } = DatePicker;
const { Option } = Select;

const option = [
	{
		name: 'Reset',
		icon: 'sync'
	}
];
const icon = {
	name: 'more',
	style: {
		background: '#d5cfcf',
		padding: '8px',
		borderRadius: '50%',
		marginTop: '4px'
	}
};
const button = {
	name: 'Save',
	type: 'submit'
};

function hasErrors(fieldsError) {
	return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class HorizontalLoginForm extends PureComponent {
	state = {
		value: 1,
		visible: false
	};
	componentDidMount() {
		// To disabled submit button at the beginning.
		this.props.form.validateFields();
	}
	showModal = () => {
		this.setState({
			visible: true
		});
	};

	handleChange = value => {
		console.log(`selected ${value}`);
	};
	handleOk = e => {
		console.log(e);
		this.setState({
			visible: false
		});
	};

	handleCancel = e => {
		console.log(e);
		this.setState({
			visible: false
		});
	};
	_onChangeRadioCheckbox = e => {
		console.log('radio checked', e.target.value);
		this.setState({
			value: e.target.value
		});
	};
	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log('Received values of form: ', values);
			}
		});
	};

	render() {
		const { getFieldError, isFieldTouched } = this.props.form;

		// Only show error after a field is touched.

		return (
			<Form layout="inline" onSubmit={this.handleSubmit}>
				<div>
					
					<HeaderContent name="Create User" id="#123456" option={option} icon={icon} button={button} />
					<div
						style={{
							width: '100% + 48px',
							marginLeft: '-24px',
							marginRight: '-24px'
						}}>
						<Divider />
					</div>
				</div>

				<div style={{ padding: '40px' }}>
					<div
						style={{
							display: 'flex',
							//alignItems: 'center',
							justifyContent: 'space-between',
							width: '40%'
						}}>
						<Form.Item required={true}>
							<Input
								size="large"
								placeholder="Name"
								style={{
									borderTop: '0',
									borderRight: '0',
									borderLeft: '0',
									width: '200px',
									paddingLeft: 0
								}}
							/>
						</Form.Item>
						<Form.Item>
							<Input
								size="large"
								placeholder="Email"
								style={{
									borderTop: '0',
									borderRight: '0',
									borderLeft: '0',
									width: '200px',
									paddingLeft: 0
								}}
							/>
						</Form.Item>
					</div>
				</div>
			</Form>
		);
	}
}

export const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_login' })(HorizontalLoginForm);
