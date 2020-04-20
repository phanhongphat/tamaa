import React, { PureComponent } from 'react';
import { Row, Col, Icon, Typography, Button, message, Divider, Popover, Alert } from 'antd';

import { FormattedRelative, FormattedMessage, defineMessages } from 'react-intl';
import DisplayTime from './DisplayTime';
import CloseMsg from './CloseMsg';

const { Text } = Typography;
// let result = {};

export default class NormalDay extends PureComponent {
	state = {
		daysOfWeek: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
		daysOfWeekE: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
	};

	render() {
		const { _key2, conditions } = this.props;
		const { daysOfWeek, daysOfWeekE, isEdit } = this.state;
		const exceptionDays = conditions[_key2];
		return (
			<Row>
				<Col md={24} lg={15}>
					<Row>
						<Col span={24}>
							{daysOfWeekE.map((day, index) => {
								return (
									<Row style={{ padding: '5px' }} key={index}>
										<Col md={7} lg={7} xl={7}>
											<Icon type="calendar" />
											<Text strong>{` ${daysOfWeek[index]}`}</Text>
										</Col>
										<Col md={16} lg={16} xl={16}>
											{conditions[day.toLowerCase()] !== undefined ? (
												<Row>
													<Col span={12}>
														<DisplayTime condition={conditions[day.toLowerCase()]} />
													</Col>
												</Row>
											) : (
												<CloseMsg />
											)}
										</Col>
									</Row>
								);
							})}
						</Col>
					</Row>
					<Row>
						<Col span={12}>
							<Divider />
						</Col>
					</Row>
					<Row>
						<Col span={24}>
							{exceptionDays &&
								Object.keys(exceptionDays).map((day, index) => {
									return (
										<Row style={{ padding: '5px' }} key={index}>
											<Col md={7} lg={7} xl={7}>
												<Icon type="calendar" />
												<Text strong>{` ${day}`}</Text>
											</Col>
											<Col md={16} lg={16} xl={16}>
												{exceptionDays[day] !== undefined && exceptionDays[day] !== null ? (
													<Row>
														<Col span={12}>
															<DisplayTime condition={exceptionDays[day]} />
														</Col>
													</Row>
												) : (
													<CloseMsg />
												)}
											</Col>
										</Row>
									);
								})}
						</Col>
					</Row>
				</Col>
				<Col md={24} lg={9} xl={9}>
					<strong>
						<b style={{ marginRight: '10px' }}>
							<FormattedMessage id="empoloyee.dailyAmount" defaultMessage="Daily amount" />:
						</b>
						{this.props.companyDailyAmount ? this.props.companyDailyAmount : 'Pas de limites'}
					</strong>
				</Col>
			</Row>
		);
	}
}
