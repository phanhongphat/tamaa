import React, { PureComponent } from 'react';

import { updateCompanieInfo } from 'src/redux/actions/companies';
import { editEmployeeRequest } from 'src/redux/actions/employee';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import injectSheet from 'react-jss';
import styles from './styles';

import { Form, Input, Row, Col, Button, Typography, Icon } from 'antd';
import SampleButton from 'src/containers/CompanyDetail/Credits/CreditConditions/NormalDay/button';

const { Text } = Typography;
const { TextArea } = Input;

function numberWithSpaces(x) {
	return x.toString().replace(/^(.{4})(.{2})(.{3})(.*)$/, '$1 $2 $3 $4');
}

let type = undefined;
const mapDispatchToProps = dispatch => ({
	action: bindActionCreators(
		{
			updateCompanieInfo,
			editEmployeeRequest
		},
		dispatch
	)
});

@injectSheet(styles)
@connect(
	null,
	mapDispatchToProps
)
export default class InputEdit extends PureComponent {
	state = {
		isEdit: false,
		isNumber: /^\d+$/,
		isLength: /\b\d{7,9}\b/,
		status: ''
	};

	onChange = e => {
		e.target.value.length > 0
			? this.setState({
					value: e.target.value
			  })
			: this.setState({ value: '' });
		// : this.setState({ isEdit: false });
	};

	onNumberChange = e => {
		if (!this.state.isNumber.test(e.target.value) && e.target.value) this.setState({ status: 'Number only' });
		else if (e.target.value === '') this.setState({ status: '', value: null });
		else this.setState({ status: '', value: Number(e.target.value) });
	};

	onPhoneChange = e => {
		if (!this.state.isNumber.test(e.target.value) && e.target.value)
			this.setState({ status: 'Numéro de téléphone doit comporter entre 10 et 12 caractères' });
		else if (!this.state.isLength.test(e.target.value) && e.target.value)
			this.setState({ status: 'Numéro de téléphone doit comporter entre 10 et 12 caractères' });
		else if (!this.props.isNull && e.target.value === '')
			this.setState({
				status: 'Veuillez saisir votre numéro de téléphone'
			});
		else this.setState({ status: '', value: e.target.value });
	};

	save = () => {
		const { id, stateName, type, role, isNull } = this.props;
		const { value, status } = this.state;

		if (status) this.setState({ isEdit: false, status: '' });
		else if (!isNull && value === '') this.setState({ isEdit: false });
		else {
			let emptyPhone = false;
			if (value === '' && stateName === 'phoneNumber2') emptyPhone = true;
			const payload = {
				id,
				[stateName]: type === 'phone' ? (emptyPhone ? value : `689${value}`) : value,
				restriction: false
			};
			// console.log(payload);
			// return;
			if (role !== 'employee') {
				this.props.action.updateCompanieInfo(
					payload,
					() => {
						this.setState({ loading: false, isEdit: false });
					},
					() => this.setState({ loading: false })
				);
			} else {
				this.props.action.editEmployeeRequest(
					payload,
					next => {
						this.setState({ loading: false, isEdit: false });
					},
					nextErr => this.setState({ loading: false })
				);
			}
		}
	};

	cancel = () => {
		this.setState({ isEdit: false, status: '' });
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const { isEdit } = this.state;
		const { value, name, stateName, customId, classes, size, edit } = this.props;

		if (this.props.type === 'input')
			type = <Input onChange={this.onChange} placeholder={value} style={{ width: '90%' }} />;
		if (this.props.type === 'number')
			type = <Input onChange={this.onNumberChange} placeholder={value} style={{ width: '90%' }} />;
		if (this.props.type === 'area')
			type = <TextArea rows={5} onChange={this.onChange} placeholder={value} style={{ width: '90%' }} />;
		if (this.props.type === 'phone')
			type = (
				<Input
					addonBefore="+689"
					onChange={this.onPhoneChange}
					placeholder={value && value.slice(3)}
					style={{ width: '90%' }}
				/>
			);

		return (
			<Form.Item
				help={name === 'Numéro de téléphone' ? this.state.status : ''}
				validateStatus={this.state.status ? 'error' : ''}>
				<Row>
					<Col span={size ? size[0] : 8}>
						<Text strong>{name}</Text>
					</Col>
					<Col span={size ? size[1] : 8}>
						{getFieldDecorator(name || stateName, {
							initialValue: value && this.props.type === 'phone' ? value.slice(3) : value,
							rules: [
								{
									required: true,
									message: 'Please input your' + name
								}
							]
						})(
							!isEdit ? (
								<>
									{value === null || value === '' ? (
										<Text style={{ whiteSpace: 'nowrap' }}>
											{value === null && stateName === 'dailyAmount' ? 'Pas de limites' : 'Néant'}
										</Text>
									) : (
										<Text style={{ whiteSpace: 'nowrap' }}>
											{this.props.type === 'phone'
												? numberWithSpaces(value ? '+' + value : 'Néant')
												: value}
										</Text>
									)}
									<br />
									{customId && <Text>ID: {customId}</Text>}
								</>
							) : (
								type
							)
						)}
					</Col>
					{edit && (
						<Col span={size ? size[2] : 8} push={size && size[3]}>
							{!isEdit ? (
								// value && (
								<Button type="link" onClick={() => this.setState({ isEdit: true })}>
									<Icon type="form" />
									Modifier
								</Button>
							) : (
								// )
								<Button.Group>
									<SampleButton name="Annuler" action={this.cancel} type="" />{' '}
									<SampleButton name="Sauvegarder" action={this.save} type="primary" />
								</Button.Group>
							)}
						</Col>
					)}
				</Row>
			</Form.Item>
		);
	}
}
