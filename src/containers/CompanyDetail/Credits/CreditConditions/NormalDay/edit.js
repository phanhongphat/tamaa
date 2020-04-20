import React, { PureComponent, useState, useEffect } from 'react';
import SampleButton from 'src/containers/CompanyDetail/Credits/CreditConditions/NormalDay/button';
import OpenHouse from 'src/components/OpenHouse';

import { Row, Col, Icon, Typography, Button, Divider, Radio, Tooltip, Tag } from 'antd';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateCompanieInfo, getCompanieInfo } from 'src/redux/actions/companies';
import { editEmployeeRequest, getEmployeeDetails } from 'src/redux/actions/employee';
import { editRestaurant, getDetailRestaurant } from 'src/redux/actions/restaurant';

const { Text } = Typography;

const mapDispatchToProps = dispatch => ({
	action: bindActionCreators(
		{
			updateCompanieInfo,
			editEmployeeRequest,
			editRestaurant,
			// getEmployeeDetails,
			// getCompanieInfo,
			getDetailRestaurant
		},
		dispatch
	)
});
@connect(
	null,
	mapDispatchToProps
)
class EditRow extends PureComponent {
	state = {
		openingHour: {}
	};
	setDataOutput = data => {
		const noException = ({ monday, tuesday, wednesday, thursday, friday, saturday, sunday, ...rest }) => rest;
		const exceptions = noException(data);

		const normal = {
			monday: data.monday,
			tuesday: data.tuesday,
			wednesday: data.wednesday,
			thursday: data.thursday,
			friday: data.friday,
			saturday: data.saturday,
			sunday: data.sunday
		};
		this.setState({ openingHour: { ...normal, exceptions } });
	};

	handleUpdate = () => {
		const { id, exceptions, stateName } = this.props;
		const payload = {
			id,
			[stateName]: this.state.openingHour,
			restriction: false
		};
		// console.log(payload);
		// return;
		if (stateName === 'companyConditions') this.props.updateCompany(payload, id);
		else if (stateName === 'employeeConditions') this.props.updateEmployee(payload, id);
		else if (stateName === 'openingHours') this.props.updateRestaurant(payload, id);
	};

	componentDidMount() {
		const { normal, exceptions } = this.props;
		this.setState({ openingHour: { ...normal, exceptions } });
	}
	render() {
		// console.log(this.state.openingHour);
		const { normal, exceptions } = this.props;
		return (
			<>
				<OpenHouse normalDay={normal} setDataOutput={this.setDataOutput} exceptions={exceptions} />{' '}
				<Button.Group>
					<SampleButton name="Annuler" action={() => this.props.toggleEdit()} />{' '}
					<SampleButton name="Sauvegarder" type="primary" action={this.handleUpdate} />
				</Button.Group>
			</>
		);
	}
}
@connect(
	null,
	mapDispatchToProps
)
export default class ConditionEdit extends PureComponent {
	state = {
		isEdit: false,
		value: undefined
	};

	toggleEdit = () => {
		this.setState({
			isEdit: !this.state.isEdit
		});
	};

	noRestriction = () => {
		const { id, exceptions, stateName } = this.props;
		const optionalDate = {
			monday: ['00:00-23:59'],
			tuesday: ['00:00-23:59'],
			wednesday: ['00:00-23:59'],
			thursday: ['00:00-23:59'],
			friday: ['00:00-23:59'],
			saturday: ['00:00-23:59'],
			sunday: ['00:00-23:59'],
			exceptions: {}
			// exceptions: { ...(exceptions || {}) }
		};
		const payload = {
			id,
			[stateName]: { ...optionalDate },
			dailyAmount: null,
			restriction: true
		};
		// console.log(payload);
		if (stateName === 'companyConditions') this.updateCompany(payload, id);
		else if (stateName === 'employeeConditions') this.updateEmoloyee(payload, id);
		else if (stateName === 'openingHours') this.updateRestaurant(payload, id);
	};

	updateCompany = (payload, id) => {
		this.props.action.updateCompanieInfo(
			payload,
			() => {
				this.setState({ loading: false, isEdit: false });
				// this.props.action.getCompanieInfo({ id });
			},
			() => this.setState({ loading: false })
		);
	};

	updateEmoloyee = (payload, id) => {
		this.props.action.editEmployeeRequest(
			payload,
			() => {
				this.setState({ loading: false, isEdit: false });
				// this.props.action.getEmployeeDetails({ id });
			},
			() => this.setState({ loading: false })
		);
	};

	updateRestaurant = (payload, id) => {
		this.props.action.editRestaurant(
			payload,
			() => {
				this.setState({ loading: false, isEdit: false });
				this.props.action.getDetailRestaurant({ id });
			},
			() => this.setState({ loading: false })
		);
	};

	componentDidMount() {
		const { restriction } = this.props;
		console.log(restriction);
		restriction ? this.setState({ value: 1 }) : this.setState({ value: 2 });
	}

	render() {
		const { normal, exceptions } = this.props;
		const { isEdit, value } = this.state;
		// console.log(normal, exceptions);
		return (
			<Row>
				{!isEdit ? (
					<Row type="flex" justify="space-between">
						<Col span={20}>
							<DisplayRow1 normal={normal} exceptions={exceptions} />
							<div style={{ padding: '10px' }}></div>
							<DisplayRow2 normal={normal} exceptions={exceptions} />
						</Col>
						<Col span={4} pull={10}>
							<SampleButton name="Modifier" icon="form" type="link" action={this.toggleEdit} />
						</Col>
					</Row>
				) : (
					<>
						<Radio.Group defaultValue={value} onChange={e => this.setState({ value: e.target.value })}>
							<Radio value={1}>Pas de restrictions</Radio>{' '}
							<Tooltip title="Pas de restrictions: lorsque vous appliquez cette règle, l'entreprise et ses employés peuvent payer à tout moment de 00h00 à 23h59 et ne pas avoir de limite sur le montant journalier.">
								<Tag>?</Tag>
							</Tooltip>
							<Radio value={2}>Douane</Radio>
						</Radio.Group>
					</>
				)}
				{isEdit && value === 1 && (
					<div style={{ marginTop: '10px' }}>
						<Button.Group>
							<SampleButton name="Annuler" action={this.toggleEdit} type="" />{' '}
							<SampleButton name="Sauvegarder" action={this.noRestriction} type="primary" />
						</Button.Group>
					</div>
				)}
				{isEdit && value === 2 && (
					<EditRow
						normal={normal}
						exceptions={exceptions}
						toggleEdit={this.toggleEdit}
						id={this.props.id}
						stateName={this.props.stateName}
						updateCompany={this.updateCompany}
						updateEmployee={this.updateEmoloyee}
						updateRestaurant={this.updateRestaurant}
					/>
				)}
			</Row>
		);
	}
}

const DisplayRow1 = props => {
	const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
	const stateName = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

	const { normal } = props;

	const row = daysOfWeek.map((day, index) => {
		return (
			<Row style={{ marginBottom: '10px' }}>
				<Col md={24} lg={7} xl={6}>
					<Icon type="calendar" />
					<Text strong>{` ${day}`}</Text>
				</Col>
				<Col md={24} lg={12} xl={15}>
					{/* {console.log(normal[stateName[index]])} */}
					{normal[stateName[index]] !== undefined &&
						normal[stateName[index]].map(
							(d, index) =>
								d &&
								d !== null &&
								d !== undefined && (
									<Row type="flex" align="middle" key={index} gutter={5} style={{ marginTop: '1px' }}>
										{d === '00:00-00:00' ? (
											<Col>Fermer</Col>
										) : (
											// <Col span={10}>{d}</Col>
											<>
												<Col span={2}>{d.slice(0, 5)}</Col>
												<Col span={1} style={{ margin: '0 10px' }}>
													&mdash;
												</Col>
												<Col span={10}>{d.slice(-5)}</Col>
											</>
										)}
									</Row>
								)
						)}
				</Col>
			</Row>
		);
	});

	return row;
};

const DisplayRow2 = props => {
	const [exceptionStateName, setExceptionStateName] = useState([]);
	const { exceptions } = props;
	useEffect(() => {
		setExceptionStateName(Object.keys(exceptions));
	}, []);

	const row = exceptionStateName.map((day, index) => {
		return (
			<Row style={{ marginBottom: '10px' }}>
				<Col md={24} lg={7} xl={6}>
					<Icon type="calendar" />
					<Text strong>{` ${day}`}</Text>
				</Col>
				<Col md={24} lg={12} xl={15}>
					{exceptions[exceptionStateName[index]] !== undefined &&
						exceptions[exceptionStateName[index]].map(
							(d, index) =>
								d &&
								d !== null &&
								d !== undefined && (
									<Row type="flex" align="middle" key={index} gutter={5} style={{ marginTop: '1px' }}>
										{d === '00:00-00:00' ? (
											<Col>Fermer</Col>
										) : (
											// <Col span={10}>{d}</Col>
											<>
												<Col span={2}>{d.slice(0, 5)}</Col>
												<Col span={1} style={{ margin: '0 10px' }}>
													&mdash;
												</Col>
												<Col span={10}>{d.slice(-5)}</Col>
											</>
										)}
									</Row>
								)
						)}
				</Col>
			</Row>
		);
	});

	return row;
};
