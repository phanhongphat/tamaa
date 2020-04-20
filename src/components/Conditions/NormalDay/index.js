import React, { PureComponent } from 'react';
import { Button, Icon, Row, Col } from 'antd';

import Day from '../Day';

let result = {};

export default class NormalDay extends PureComponent {
	state = {
		dayName: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
		stateName: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
		monday: undefined,
		tuesday: undefined,
		wednesday: undefined,
		thursday: undefined,
		friday: undefined,
		saturday: undefined,
		sunday: undefined,
		apply: false,
		for: undefined,
		applyDay: undefined,
		applyLength: undefined
	};

	getDayTime = async (time, day) => {
		const { getAcceptedDay } = this.props;
		console.log(time);
		await this.setState({ [day]: [...time] });
		time.length > 0 ? (result = { ...result, [day]: [...time] }) : delete result[day];
		getAcceptedDay(result);
		// console.log(result);
	};

	applyAll = async () => {
		const { getAcceptedDay } = this.props;

		// TODO: continue to develop apply all feature
		// console.log(result[Object.keys(result)].length);
		result[Object.keys(result)] && this.setState({ applyLength: result[Object.keys(result)].length });
		if (Object.keys(result).length === 0 && result[Object.keys(result)] === undefined) console.log(1);
		else {
			const keys = Object.keys(result)[Object.keys(result).length - 1];
			const value = result[keys];
			// if (oldLength !== length) console.log(1);
			this.setState({ apply: !this.state.apply, for: keys, applyDay: value });
			const all = {
				monday: value,
				tuesday: value,
				wednesday: value,
				thursday: value,
				friday: value,
				saturday: value,
				sunday: value
			};
			// apply is contrary

			if (this.state.apply) {
				getAcceptedDay(result);
				this.deApply();
			} else getAcceptedDay(all);
		}
	};

	deApply = () => {
		this.setState({ apply: false, applyDay: undefined, applyLength: undefined });
	};

	render() {
		const { dayName, stateName, apply, applyDay, applyLength } = this.state;

		return (
			<div style={{ position: 'relative' }}>
				{dayName.map((day, index) => (
					<Day
						key={index}
						day={stateName[index]}
						name={day}
						getDayTime={this.getDayTime}
						apply={apply}
						deApply={this.deApply}
						applyDay={applyDay}
						applyLength={applyLength}
					/>
				))}
				<div style={{ position: 'absolute', top: '0', left: '650px' }}>
					<Button onClick={this.applyAll} type="link">
						{!apply ? (
							<>
								<Icon type="arrow-down" />
								Apply to all
							</>
						) : (
							`Unapply ${this.state.for}`
						)}
					</Button>
				</div>
			</div>
		);
	}
}
