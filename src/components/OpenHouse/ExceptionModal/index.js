import React, { PureComponent } from 'react';
import { Modal, Typography, Row, Col, Select, DatePicker, Radio, message, Checkbox, Form } from 'antd';

import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import SampleButton from 'src/containers/CompanyDetail/Credits/CreditConditions/NormalDay/button';

const { Text } = Typography;
const { Option } = Select;
let PREFIX = ['Première', 'Seconde', 'Troisième'];
const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const MONTHS = [
	'Janvier',
	'Février',
	'Mars',
	'Avril',
	'Mai',
	'Juin',
	'Juillet',
	'Août',
	'Septembre',
	'Octobre',
	'Novembre',
	'Décembre'
];
let name1 = [];
let name2 = [];

@Form.create()
export default class ExceptionModal extends PureComponent {
	state = {
		loading: false,
		visible: false,
		radio: 1,
		everyYear: false
	};

	showModal = () => {
		this.setState({
			visible: true
		});
	};

	handleOk = () => {
		let name = '';
		// if (newName.length < 3) {
		if (name1.length === 3 || typeof name2 === 'string') {
			name = name1.length === 3 ? `${name1[0]} ${name1[1]} De ${name1[2]}` : this.state.temp || name2;
			this.props.addNewRow(name, ['00:00-00:00']);
			this.setState({ visible: false, everyYear: false, temp: undefined });
			this.resetForm();
		} else {
			console.log('name1 ===>', name1);
			console.log('name2 ===>', name2);
			message.error('Invalid name');
		}
	};

	handleCancel = () => {
		this.resetForm();
		this.setState({ visible: false });
	};

	handleRadioChange = e => {
		name1 = [];
		name2 = [];

		this.setState({ radio: e.target.value });
		this.resetForm();
	};

	resetForm = () => {
		name1 = [];
		name2 = [];
		this.setState({ everyYear: false });
		this.props.form.setFieldsValue({
			day: undefined,
			day1: undefined,
			day2: undefined,
			day3: undefined
		});
	};

	handleGetName = (e, index) => {
		if (typeof e === 'string') name1 = [...name1, e];
		else {
			e = e ? (this.state.everyYear ? e.format('DD/MM') : e.format('DD/MM/YYYY')) : '';
			name2 = e;
		}
	};

	everyYear = () => {
		this.setState({ everyYear: !this.state.everyYear });
		this.setState({ temp: !this.state.everyYear ? name2.slice(0, -5) : name2 });
	};

	render() {
		const { loading, visible, radio } = this.state;

		return (
			<div>
				<SampleButton name="Ajouter un exception" type="link" action={this.showModal} icon="plus" />
				<Modal
					visible={visible}
					title={null}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					footer={[
						<SampleButton name="Annuler" action={this.handleCancel} type="" />,
						<SampleButton name="Sauvegarder" action={this.handleOk} type="primary" loading={loading} />
					]}>
					<Row>
						<Col span={24}>
							<Text>Date d'exception</Text>
						</Col>
					</Row>
					<Radio.Group onChange={this.handleRadioChange} value={radio} style={{ width: '90%' }}>
						<RadioRow rowNo={1} />

						<_Layout
							size={[8, 7, 6]}
							radio={radio}
							condition={2}
							left={
								<SelectForm
									name="day"
									action={this.handleGetName}
									form={this.props.form}
									store={PREFIX}
								/>
							}
							middle={
								<SelectForm
									name="day1"
									action={this.handleGetName}
									form={this.props.form}
									store={DAYS}
								/>
							}
							right={
								<SelectForm
									name="day2"
									action={this.handleGetName}
									form={this.props.form}
									store={MONTHS}
								/>
							}
						/>

						<RadioRow rowNo={2} />

						<_Layout
							size={[12, 0, 12]}
							radio={radio}
							condition={1}
							left={
								<DateForm
									name="day3"
									action={this.handleGetName}
									state={this.state.everyYear}
									form={this.props.form}
								/>
							}
							right={<EveryYearBtn action={() => this.everyYear()} state={this.state.everyYear} />}
						/>
					</Radio.Group>
				</Modal>
			</div>
		);
	}
}

const _Layout = props => {
	const { left, middle, right, radio, condition, size } = props;

	return (
		<Row style={radio == condition ? disabledField : null}>
			<Col push={2} span={size[0] || 8}>
				{left}
			</Col>
			<Col push={2} span={size[1] || 8}>
				{middle}
			</Col>
			{size[1] === 7 && (
				<Col style={{ marginLeft: '16px', marginTop: '7px' }} push={2} span={2}>
					De
				</Col>
			)}
			<Col push={2} span={size[2] || 8}>
				{right}
			</Col>
		</Row>
	);
};

const disabledField = {
	pointerEvents: 'none',
	opacity: 0.3
};

const RadioRow = ({ rowNo }) => {
	return (
		<Row style={{ padding: '10px 5px' }}>
			<Col span={24}>
				<Radio value={rowNo}>
					<Text strong>
						<FormattedMessage id="specificDay" defaultMessage="Specific day" />
					</Text>
				</Radio>
			</Col>
		</Row>
	);
};

class SelectForm extends PureComponent {
	render() {
		const { name, action, form, store } = this.props;
		const { getFieldDecorator } = form;
		return (
			<Form.Item>
				{getFieldDecorator(`${name}`)(
					<Select style={{ width: '130px' }} onChange={e => action(e, 1)}>
						{store.map((day, index) => (
							<Option key={index} value={day}>
								{day}
							</Option>
						))}
					</Select>
				)}
			</Form.Item>
		);
	}
}

class DateForm extends PureComponent {
	render() {
		const { name, action, state, form } = this.props;
		const { getFieldDecorator } = form;
		return (
			<Col md={15}>
				<Form.Item>
					{getFieldDecorator(`${name}`)(
						<DatePicker
							format={state ? 'DD/MM' : 'DD/MM/YYYY'}
							onChange={e => action(e, 0)}
							style={{ width: '250px' }}
						/>
					)}
				</Form.Item>
			</Col>
		);
	}
}

const EveryYearBtn = ({ state, action }) => {
	return (
		<Col md={8} style={{ margin: '12px 50px', width: '500px' }}>
			<Checkbox checked={state} onChange={() => action()}>
				<FormattedMessage id="empoloyee.everyYear" defaultMessage="Every year" />
			</Checkbox>
		</Col>
	);
};
