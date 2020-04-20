import React, { PureComponent } from 'react';
import { Modal, Typography, Row, Col, Select, DatePicker, Button, Radio, Icon, message, Checkbox, Form } from 'antd';

// import styles from './styles';
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
let newName = [];

@Form.create()
export default class ExceptionModal extends PureComponent {
	state = {
		loading: false,
		visible: false,
		radio: 1
	};

	showModal = () => {
		this.setState({
			visible: true
		});
	};

	resetForm = () => {
		this.props.form.setFieldsValue({
			day: undefined,
			day1: undefined,
			day2: undefined,
			day3: undefined
		});
		newName = [];
	};

	handleOk = () => {
		const { radio } = this.state;
		console.log(newName.length);
		if (newName.length < 3 && radio === 1) message.error('Nom incorrect');
		else {
			this.props.getExceptionDay(newName);
			this.setState({ loading: true });
			setTimeout(() => {
				this.setState({ loading: false, visible: false });
			}, 300);
			this.resetForm();
		}
	};

	handleCancel = () => {
		this.resetForm();
		this.setState({ visible: false });
	};

	handleRadioChange = e => {
		newName = e.target.value === 1 ? [] : ['1', '', ''];
		this.setState({ radio: e.target.value });
		this.resetForm();
	};

	handleGetName = (e, index) => {
		typeof e === 'object' && e !== null ? (e = e.format('DD/MM/YYYY')) : e;
		if (typeof e === 'object' && e !== null) {
			e = e.format('DD/MM/YYYY');
			newName = [...newName, e];
		} else {
			newName[index] = e;
		}
	};

	render() {
		const { loading, visible, radio } = this.state;
		const { getFieldDecorator } = this.props.form;

		return (
			<div>
				<SampleButton name="Ajouter une exception" type="link" icon="plus" action={this.showModal} />
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
						<Row style={{ padding: '10px 5px' }}>
							<Col span={24}>
								<Radio value={1}>
									<Text strong>
										<FormattedMessage id="titleOptional" defaultMessage="Title optional" />
									</Text>
								</Radio>
							</Col>
						</Row>
						<Row style={radio == 2 ? disabledField : null}>
							<Col span={8} push={2}>
								<Form.Item hasFeedback>
									{getFieldDecorator('day', {
										rules: [
											{
												required: true,
												message: 'Veuillez choisir le nom du jour'
											}
										]
									})(
										<Select style={{ width: '80%' }} onChange={e => this.handleGetName(e, 0)}>
											{PREFIX.map((prefix, index) => (
												<Option key={index} value={prefix}>
													{prefix}
												</Option>
											))}
										</Select>
									)}
								</Form.Item>
							</Col>
							<Col span={7} push={2}>
								<Form.Item hasFeedback>
									{getFieldDecorator('day1', {
										rules: [
											{
												required: true,
												message: 'Veuillez choisir le nom du jour'
											}
										]
									})(
										<Select style={{ width: '100%' }} onChange={e => this.handleGetName(e, 1)}>
											{DAYS.map((day, index) => (
												<Option key={index} value={day}>
													{day}
												</Option>
											))}
										</Select>
									)}
								</Form.Item>
							</Col>
							<Col span={1} push={2}>
								<Button type="link" style={{ color: 'black', padding: '0 15px' }}>
									<FormattedMessage id="from" defaultMessage="of" />
								</Button>
							</Col>
							<Col span={7} push={4}>
								<Form.Item hasFeedback>
									{getFieldDecorator('day2', {
										rules: [
											{
												required: true,
												message: 'Veuillez choisir le nom du jour'
											}
										]
									})(
										<Select style={{ width: '100%' }} onChange={e => this.handleGetName(e, 2)}>
											{MONTHS.map((month, index) => (
												<Option key={index} value={month}>
													{month}
												</Option>
											))}
										</Select>
									)}
								</Form.Item>
							</Col>
						</Row>
						<Row style={{ padding: '10px 5px' }}>
							<Col span={24}>
								<Radio value={2}>
									<Text strong>
										<FormattedMessage id="specificDay" defaultMessage="Specific day" />
									</Text>
								</Radio>
							</Col>
						</Row>
						<Row style={radio === 1 ? disabledField : null} type="flex" align="middle">
							<Col span={15} push={2}>
								<Form.Item>
									{getFieldDecorator('day3', {
										rules: [
											{
												required: true,
												message: 'Veuillez choisir le nom du jour'
											}
										]
									})(
										<DatePicker
											onChange={e => this.handleGetName(e, 0)}
											style={{ width: '100%' }}
										/>
									)}
								</Form.Item>
							</Col>
							<Col style={{ marginBottom: '22px' }} span={9} push={3}>
								<Checkbox>
									<FormattedMessage id="empoloyee.everyYear" defaultMessage="Every year" />
								</Checkbox>
							</Col>
						</Row>
					</Radio.Group>
				</Modal>
			</div>
		);
	}
}

const disabledField = {
	pointerEvents: 'none',
	opacity: 0.3
};
