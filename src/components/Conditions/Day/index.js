import React, { PureComponent } from 'react';
import { Icon, TimePicker, Checkbox, Button, Row, Col, Form, Tooltip } from 'antd';
import moment from 'moment';

const format = 'HH:mm';
let result = [];

let count = 0;

@Form.create()
export default class Day extends PureComponent {
	state = {
		from1: undefined,
		from2: undefined,
		from3: undefined,
		to1: undefined,
		to2: undefined,
		to3: undefined,
		hide1: true,
		hide2: true,
		validate1: false,
		validate2: false,
		validate3: false,
		isChecked: false
	};

	changeTime = async (value, stateName) => {
		// const { from1, from2, from3, to1, to2, to3, isChecked, hide1, hide2 } = this.state;
		const { isChecked } = this.state;
		await this.setState({ [stateName]: value ? value.format(format) : undefined });
		(await !isChecked) && this.getTime();
		this.props.deApply && this.props.deApply();
	};

	// handleCheck = async () => {
	// 	const { isChecked } = this.state;
	// 	const { getDayTime, day, defaultVal } = this.props;
	// 	// console.log(defaultVal, day);
	// 	await this.setState({ isChecked: !isChecked });

	// 	if (isChecked) this.getTime();
	// 	else {
	// 		defaultVal ? (result = [...defaultVal]) : (result = []);
	// 		getDayTime(result, day);
	// 	}
	// 	this.props.deApply && this.props.deApply();
	// };

	getTime = e => {
		const { from1, from2, from3, to1, to2, to3, hide1, hide2, isChecked } = this.state;
		const { getDayTime, day } = this.props;

		if (from1 && to1 && from1 < to1) {
			result[0] = from1 + '-' + to1;
		} else {
			delete result[0];
		}

		if (!hide1 && from2 && to2 && from2 < to2) result[1] = from2 + '-' + to2;
		else delete result[1];

		if (!hide2 && from3 && to3 && from3 < to3) result[2] = from3 + '-' + to3;
		else delete result[2];

		// console.log(result);
		getDayTime(result, day);
	};

	open = async () => {
		const { isChecked } = this.state;
		count++;
		count > 2 ? (count = 2) : null;
		(await !isChecked) && this.getTime();
		count === 1 && this.setState({ hide1: false, hide2: true });
		count === 2 && this.setState({ hide1: false, hide2: false });
	};

	close2 = async () => {
		const { isChecked } = this.state;
		count--;
		this.setState({ hide1: true, from2: undefined, to2: undefined });
		(await !isChecked) && this.getTime();
		this.props.deApply && this.props.deApply();
	};

	close3 = async () => {
		count--;
		const { isChecked } = this.state;
		this.setState({ hide2: true, from3: undefined, to3: undefined });
		(await !isChecked) && this.getTime();
		this.props.deApply && this.props.deApply();
	};

	validateFromTo = () => {
		const { from1, from2, from3, to1, to2, to3, validate1, validate2, validate3 } = this.state;
		to1 && from1 >= to1 ? this.setState({ validate1: true }) : this.setState({ validate1: false });
		to2 && from2 >= to2 ? this.setState({ validate2: true }) : this.setState({ validate2: false });
		to3 && from3 >= to3 ? this.setState({ validate3: true }) : this.setState({ validate3: false });
	};

	closed = (day, name) => {
		this.props.closed(day, name);
	};

	componentDidMount() {
		const length = this.props.defaultVal ? this.props.defaultVal.length : 0;
		if (length === 2) this.setState({ hide1: false, hide2: true });
		else if (length === 3) this.setState({ hide1: false, hide2: false });
	}

	render() {
		const {
			hide1,
			hide2,
			from1,
			to1,
			from2,
			from3,
			to2,
			to3,
			validate1,
			validate2,
			validate3,
			isChecked,
			overlapStatus
		} = this.state;
		const { name, apply, applyDay, defaultVal, day } = this.props;
		this.validateFromTo();
		let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
		let arr1 = [];
		let arr2 = [];
		to1 ? (arr1 = arr.filter(a => a < Number(to1.slice(0, 2)) + 1)) : [];
		to2 ? (arr2 = arr.filter(a => a < Number(to2.slice(0, 2)) + 1)) : [];

		return (
			<div>
				<Row>
					<Col span={6} style={{ marginTop: '10px' }}>
						<div>{name ? name : 'Hello'}</div>
					</Col>
					<Col span={18} style={{ height: '35px' }}>
						<Form.Item
							validateStatus={validate1 ? 'error' : 'success'}
							style={defaultVal ? null : apply ? null : isChecked ? disabledField : null}>
							<TimePicker
								validateStatus={validate2 ? 'error' : 'success'}
								minuteStep={15}
								format={format}
								placeholder={
									defaultVal && defaultVal[0]
										? defaultVal[0].slice(0, 5)
										: applyDay && applyDay[0]
										? applyDay[0].slice(0, 5)
										: 'De'
								}
								onChange={e => this.changeTime(e, 'from1')}
							/>
							{' - '}
							<TimePicker
								minuteStep={15}
								format={format}
								placeholder={
									defaultVal && defaultVal[0]
										? defaultVal[0].slice(-5)
										: applyDay && applyDay[0]
										? applyDay[0].slice(-5)
										: 'À'
								}
								onChange={e => this.changeTime(e, 'to1')}
							/>
							<Button type="link" onClick={this.open}>
								<Icon type="plus" />
							</Button>
							{this.props.closed && (
								<Button
									type="link"
									style={{ color: 'red' }}
									onClick={() => this.closed(day, name)}
									icon="close"
								/>
							)}
						</Form.Item>
					</Col>
				</Row>
				{/* 2 */}
				<Row
					style={{
						display: this.props.applyLength > 1 ? 'block' : !this.state.hide1 ? 'block' : 'none'
					}}>
					<Col span={6} />
					<Col span={18} style={{ height: '35px' }}>
						<Form.Item
							validateStatus={validate2 ? 'error' : 'success'}
							style={defaultVal ? null : apply ? null : isChecked ? disabledField : null}>
							<TimePicker
								value={from2 ? moment(from2, format) : null}
								disabledHours={() => arr1}
								disabledMinutes={() => (from2 ? [] : [0, 15, 30, 45])}
								disabled={from1 && to1 ? false : true}
								minuteStep={15}
								format={format}
								placeholder={
									defaultVal && defaultVal[1]
										? defaultVal[1].slice(0, 5)
										: applyDay && applyDay[1]
										? applyDay[1].slice(0, 5)
										: 'De'
								}
								onChange={e => this.changeTime(e, 'from2')}
							/>
							{' - '}
							<TimePicker
								value={to2 ? moment(to2, format) : null}
								disabled={from1 && to1 ? false : true}
								minuteStep={15}
								format={format}
								placeholder={
									defaultVal && defaultVal[1]
										? defaultVal[1].slice(-5)
										: applyDay && applyDay[1]
										? applyDay[1].slice(-5)
										: 'À'
								}
								onChange={e => this.changeTime(e, 'to2')}
							/>
							<Button disabled={!hide2} type="link" onClick={this.close2} style={{ color: 'orange' }}>
								<Icon type="minus" />
							</Button>
						</Form.Item>
					</Col>
				</Row>
				{/* 3 */}
				<Row style={{ display: this.props.applyLength === 3 ? 'block' : !this.state.hide2 ? 'block' : 'none' }}>
					<Col span={6} />
					<Col span={18} style={{ height: '40px' }}>
						<Form.Item
							validateStatus={validate3 ? 'error' : 'success'}
							style={defaultVal ? null : apply ? null : isChecked ? disabledField : null}>
							<TimePicker
								value={from3 ? moment(from3, format) : null}
								disabledHours={() => arr2}
								disabledMinutes={() => (from3 ? [] : [0, 15, 30, 45])}
								disabled={from2 && to2 ? false : true}
								minuteStep={15}
								format={format}
								placeholder={
									defaultVal && defaultVal[2]
										? defaultVal[2].slice(0, 5)
										: applyDay && applyDay[2]
										? applyDay[2].slice(0, 5)
										: 'De'
								}
								onChange={e => this.changeTime(e, 'from3')}
							/>
							{' - '}
							<TimePicker
								value={to3 ? moment(to3, format) : null}
								disabled={from2 && to2 ? false : true}
								minuteStep={15}
								format={format}
								placeholder={
									defaultVal && defaultVal[2]
										? defaultVal[2].slice(-5)
										: applyDay && applyDay[2]
										? applyDay[2].slice(-5)
										: 'À'
								}
								onChange={e => this.changeTime(e, 'to3')}
							/>
							<Button type="link" onClick={this.close3} style={{ color: 'orange' }}>
								<Icon type="minus" />
							</Button>
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span={6} />
					<Col span={18}>
						<Form.Item
							validateStatus="error"
							help={
								validate1 || (validate2 && !hide1) || (validate3 && !hide2)
									? 'From must be smaller than to'
									: ''
							}></Form.Item>
					</Col>
				</Row>
			</div>
		);
	}
}

const disabledField = {
	pointerEvents: 'none',
	opacity: 0.3
};
