import React, { PureComponent } from 'react';
import { Row, Col, Icon, Typography, Button, message, Tooltip, Popover, Radio, Tag } from 'antd';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateCompanieInfo, getCompanieInfo } from 'src/redux/actions/companies';
import { editEmployeeRequest, getEmployeeDetails } from 'src/redux/actions/employee';
import { editRestaurant, getDetailRestaurant } from 'src/redux/actions/restaurant';

import Day from 'src/components/Conditions/Day';
import SampleButton from './button';

const { Text } = Typography;
let result = {};
const mapDispatchToProps = dispatch => ({
	action: bindActionCreators(
		{
			updateCompanieInfo,
			getCompanieInfo,
			editEmployeeRequest,
			getEmployeeDetails,
			editRestaurant,
			getDetailRestaurant
		},
		dispatch
	)
});

message.config({
	maxCount: 1
});
let count = 0;
@connect(
	null,
	mapDispatchToProps
)
export default class NormalDay extends PureComponent {
	state = {
		isEdit: false,
		daysOfWeek: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
		stateName: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
		value: 2
	};

	updateCompany = (payload, id) => {
		this.props.action.updateCompanieInfo(
			payload,
			() => {
				this.setState({ loading: false }), this.props.action.getCompanieInfo({ id });
			},
			() => this.setState({ loading: false })
		);
	};

	updateEmoloyee = (payload, id) => {
		this.props.action.editEmployeeRequest(
			payload,
			() => {
				this.setState({ loading: false }), this.props.action.getEmployeeDetails({ id });
			},
			() => this.setState({ loading: false })
		);
	};

	updateRestaurant = (payload, id) => {
		this.props.action.editRestaurant(
			payload,
			() => {
				this.setState({ loading: false, isEdit: false }), this.props.action.getDetailRestaurant({ id });
			},
			() => this.setState({ loading: false })
		);
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
			dailyAmount: null
		};
		// console.log(payload);
		if (stateName === 'companyConditions') this.updateCompany(payload, id);
		else if (stateName === 'employeeConditions') this.updateEmoloyee(payload, id);
		else if (stateName === 'openingHours') this.updateRestaurant(payload, id);
	};

	handleUpdate = () => {
		const { id, exceptions, stateName } = this.props;
		const payload = {
			id,
			[stateName]: {
				...result,
				exceptions: { ...(exceptions || {}) }
			},
			dailyAmount: null
		};
		// console.log(payload);
		if (stateName === 'companyConditions') this.updateCompany(payload, id);
		else if (stateName === 'employeeConditions') this.updateEmoloyee(payload, id);
		else if (stateName === 'openingHours') this.updateRestaurant(payload, id);
	};

	getDayTime = async (time, day) => {
		const { conditions } = this.props;
		await this.setState({ [day.trim()]: [...time] });
		time ? (time = time.filter(el => el !== undefined)) : null;
		if (time.length > 0) {
			result = { ...result, [day.trim()]: [...time] };
		} else {
			// delete result[day];
			result[day] = conditions[day] ? [...conditions[day]] : [];
		}
		result[day] ? (result[day] = result[day].filter(el => el !== undefined)) : null;
		// getAcceptedDay(result);
		console.log(time);
	};

	closed = (day, name) => {
		if (result[day.toLowerCase()] === undefined) message.error(`${name} est déjà fermé`);
		else {
			delete result[day.toLowerCase()];
			this.handleUpdate();
		}
	};

	edit = () => {
		const { dailyAmount } = this.props;
		this.setState({ isEdit: true, value: dailyAmount === null ? 1 : 2 });
		// this.props.toggle(count++);
	};

	cancel = () => {
		this.setState({ isEdit: false, value: 2 });
	};

	componentDidMount() {
		result = { ...this.props.conditions };
	}

	render() {
		const { conditions, dailyAmount } = this.props;
		const { daysOfWeek, isEdit, stateName, value } = this.state;
		//
		return (
			<Row>
				{isEdit && (
					<Radio.Group
						defaultValue={dailyAmount === null ? 1 : 2}
						onChange={e => this.setState({ value: e.target.value })}>
						{/* <Tooltip
							title={`No restriction: When apply this, company and its according employees can pay any time from 00:00 to 23:59`}> */}
						<Radio value={1}>No restriction</Radio>{' '}
						<Tooltip title="No restriction: When apply this, company and its according employees can pay any time from 00:00 to 23:59">
							<Tag>?</Tag>
						</Tooltip>
						{/* </Tooltip> */}
						<Radio value={2}>Custom</Radio>
					</Radio.Group>
				)}
				{isEdit && value === 1 && (
					<div style={{ marginTop: '10px' }}>
						<Button.Group>
							<SampleButton name="Annuler" action={this.cancel} type="" />{' '}
							<SampleButton name="Sauvegarder" action={this.noRestriction} type="primary" />
						</Button.Group>
					</div>
				)}
				{daysOfWeek.map((day, index) => {
					return (
						<Row style={{ padding: '5px' }} key={index}>
							{/* List row  */}
							{!isEdit && (
								<Col md={24} lg={7} xl={7} style={{ marginTop: '5px' }}>
									<Icon type="calendar" />
									<Text strong>{` ${day}`}</Text>
								</Col>
							)}
							{/* {isEdit && <Col span={1} />} */}
							{isEdit && value === 2 && (
								<Col md={24} lg={12} xl={17} style={{ position: 'relative', width: '100%' }}>
									<Day
										key={index}
										day={stateName[index]}
										name={day}
										getDayTime={this.getDayTime}
										apply={this.state.apply}
										defaultVal={conditions && conditions[stateName[index]]}
										// closed={this.closed}
									/>
								</Col>
							)}
							{!isEdit && (
								<Col md={24} lg={12} xl={17}>
									{conditions[stateName[index]] !== undefined &&
									conditions[stateName[index]].length ? (
										<Row>
											<Col span={13} style={{ marginTop: '5px' }}>
												{conditions[stateName[index]].map((d, index) =>
													d && d !== null && d !== undefined ? (
														<Row type="flex" align="middle" key={index} gutter={5}>
															<Col span={6}>{d.slice(0, 5)}</Col>
															<Col span={4}>&mdash;</Col>
															<Col span={10}>{d.slice(-5)}</Col>
														</Row>
													) : (
														console.log(1)
													)
												)}
											</Col>
											<Col span={7} pull={4}>
												{day === 'Lundi' && (
													<SampleButton
														name="Modifier"
														action={this.edit}
														type="link"
														icon="form"
													/>
												)}
											</Col>
										</Row>
									) : (
										<Row>
											<Col span={13}>
												<Row>
													<Col span={3}></Col>
													<Col span={3} style={{ marginTop: '5px' }}>
														<Text>ANNULER</Text>
													</Col>
													<Col span={5}></Col>
												</Row>
											</Col>
											<Col span={7} pull={4}>
												{day === 'Lundi' && (
													<SampleButton
														name="Modifier"
														action={this.edit}
														type="link"
														icon="form"
													/>
												)}
											</Col>
										</Row>
									)}
								</Col>
							)}
						</Row>
					);
				})}
				{isEdit && value === 2 && (
					<Button.Group>
						<SampleButton name="Annuler" action={this.cancel} type="" />{' '}
						<SampleButton name="Sauvegarder" action={this.handleUpdate} type="primary" />
					</Button.Group>
				)}
			</Row>
		);
	}
}
