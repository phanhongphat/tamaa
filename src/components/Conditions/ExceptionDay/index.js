import React, { PureComponent } from 'react';
import { Layout, Popover, Button, Tooltip, Row, Col } from 'antd';

import Day from '../Day';
import ExceptionModal from '../ExceptionModal';

let result = [];

export default class DatePickers extends PureComponent {
	state = {
		dayOfWeek: []
	};

	getExceptionDay = name => {
		this.setState({
			dayOfWeek: [
				...this.state.dayOfWeek,
				`${name[0] || ''} ${name[1] || ''}${(name[2] && ' De ' + name[2]) || ''}`
			]
		});
	};

	getDayTime = async (time, day) => {
		const { getAcceptedDay } = this.props;
		await this.setState({ [day]: [...time] });
		time.length > 0 ? (result = { ...result, [day.trim()]: [...time] }) : (result = {});
		getAcceptedDay(result);
		// console.log(result);
	};

	remove = (index, day) => {
		const arr = [...this.state.dayOfWeek];
		if (index !== -1) {
			arr.splice(index, 1);
			this.setState({
				dayOfWeek: arr,
				remove: false
			});
		}
		const { getAcceptedDay } = this.props;
		day ? delete result[day.trim()] : null;
		getAcceptedDay(result);
	};

	render() {
		const { dayOfWeek } = this.state;
		// dayOfWeek.filter((day, index) => day.indexOf())
		return (
			<Layout style={{ backgroundColor: 'white' }}>
				{dayOfWeek.map((day, index) => (
					<div style={{ position: 'relative' }}>
						<Day key={index} day={day} name={day} getDayTime={this.getDayTime} closed={this.remove} />
					</div>
				))}
				<ExceptionModal getExceptionDay={this.getExceptionDay} />
			</Layout>
		);
	}
}
