import React, { PureComponent } from 'react';
import { Row, Col, Icon, Typography, Button } from 'antd';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateCompanieInfo, getCompanieInfo } from 'src/redux/actions/companies';
import { editEmployeeRequest, getEmployeeDetails } from 'src/redux/actions/employee';
import { editRestaurant, getDetailRestaurant } from 'src/redux/actions/restaurant';

import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';

import Day from 'src/components/Conditions/Day';
import ExceptionModal from 'src/components/Conditions/ExceptionModal';

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

@connect(
	null,
	mapDispatchToProps
)
export default class ExceptionDay extends PureComponent {
	state = {
		isEdit: false,
		daysOfWeek: []
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

	handleUpdate = () => {
		const { id, conditions, stateName } = this.props;
		const payload = {
			id,
			[stateName]: {
				...conditions,
				exceptions: { ...result }
			}
		};
		//console.log(payload)
		if (stateName === 'companyConditions') this.updateCompany(payload, id);
		else if (stateName === 'employeeConditions') this.updateEmoloyee(payload, id);
		else if (stateName === 'openingHours') this.updateRestaurant(payload, id);
	};

	getDayTime = async (time, day) => {
		// const { getAcceptedDay } = this.props;
		console.log(day);
		await this.setState({ [day.trim()]: [...time] });
		time.length > 0 ? (result = { ...result, [day.trim()]: [...time] }) : delete result[day];
		// getAcceptedDay(result);
	};

	closed = (day, index) => {
		// if (result[day] === undefined) message.error(`${day} is already closed`);
		if (result[day] === undefined) {
			this.remove(index, day);
		} else {
			delete result[day];
			this.handleUpdate();
		}
	};

	componentDidMount() {
		const { _key, conditions } = this.props;
		result = { ...this.props.conditions.exceptions };
		this.setState({ daysOfWeek: [...Object.keys(conditions[_key])] });
	}

	getExceptionDay = name => {
		this.setState({
			daysOfWeek: [
				...this.state.daysOfWeek,
				`${name[0] || ''} ${name[1] || ''}${(name[2] && ' de ' + name[2]) || ''}`
			],
			isEdit: true
		});
	};

	async remove(index, day) {
		const arr = [...this.state.daysOfWeek];
		if (index !== -1) {
			arr.splice(index, 1);
			this.setState({
				daysOfWeek: arr
			});
		}
		// const { getAcceptedDay } = this.props;
		console.log(this.state.daysOfWeek, index, day);
		delete result[day.trim()];
		// getAcceptedDay(result);
	}

	edit = () => {
		const { dailyAmount } = this.props;
		this.setState({ isEdit: true, value: dailyAmount === null ? 1 : 2 });
	};

	render() {
		const { _key, conditions } = this.props;
		const { daysOfWeek, isEdit } = this.state;
		const days = conditions[_key];

		return (
			<Row>
				{daysOfWeek.map((day, index) => {
					return (
						<Row style={{ padding: '5px' }} key={index}>
							{!isEdit && (
								<Col md={24} lg={7} xl={7} style={{ padding: '5px 0' }}>
									<Icon type="calendar" />
									<Text strong>{` ${day}`}</Text>
								</Col>
							)}{' '}
							{isEdit && (
								<Col md={24} lg={15} xl={17} style={{ position: 'relative', width: '100%' }}>
									<Day
										key={index}
										day={day}
										name={day}
										getDayTime={this.getDayTime}
										apply={this.state.apply}
										defaultVal={days && days[day]}
										closed={this.closed}
									/>
								</Col>
							)}
							{!isEdit && (
								<Col md={24} lg={12} xl={17}>
									{days[day] !== undefined ? (
										<Row>
											<Col span={13} style={{ padding: '5px 0' }}>
												{days[day].map(
													(d, index) =>
														d !== null && (
															<Row type="flex" align="middle" key={index} gutter={5}>
																<Col span={6}>{d.slice(0, 5)}</Col>
																<Col span={4}>&mdash;</Col>
																<Col span={10}>{d.slice(-5)}</Col>
															</Row>
														)
												)}
											</Col>
											<Col span={7} pull={4}>
												{index === 0 && (
													<Button onClick={() => this.setState({ isEdit: true })} type="link">
														<Icon type="form" />
														Modifier
													</Button>
												)}
											</Col>
										</Row>
									) : (
										<Row>
											<Col span={13}>
												<Row>
													<Col span={4}></Col>
													<Col span={3}>
														<Text>ANNULER</Text>
													</Col>
													<Col span={5}></Col>
												</Row>
											</Col>
											<Col span={7} pull={4}>
												{index === 0 && (
													<Button onClick={this.edit} type="link">
														<Icon type="form" />
														Modifier
													</Button>
												)}
											</Col>
										</Row>
									)}
								</Col>
							)}
						</Row>
					);
				})}
				<ExceptionModal getExceptionDay={this.getExceptionDay} />
				{isEdit && (
					<Button.Group>
						<Button
							onClick={() => this.setState({ isEdit: false })}
							style={{ border: '1px solid lightgrey' }}>
							<FormattedMessage id="cancel" defaultMessage="Cancel" />
						</Button>{' '}
						<Button onClick={this.handleUpdate} type="primary">
							<FormattedMessage id="save" defaultMessage="Save" />
						</Button>
					</Button.Group>
				)}
			</Row>
		);
	}
}
