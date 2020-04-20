import React, { PureComponent } from 'react';
import { Row, Col, Checkbox, TimePicker, Button, Icon, Form } from 'antd';
import styles from '../styles';
import moment from 'moment';

const store = [];
let from = null;
let to = null;

export default class Exception extends PureComponent {
	state = {
		isChecked: false,
		count: 0,
		format: 'HH:mm',
		alert: false
	};

	add(name, value, opt, store) {
		opt ? (value--, store.splice(value + 1, 1)) : value++;
		if (value > 2) value = 2;
		this.setState({ [name]: value });
	}

	row(value, name, id, _store) {
		const { _defaultValue } = this.props;
		const { format } = this.state;
		return (
			<Button.Group style={{ marginTop: '3px' }}>
				<TimePicker
					defaultValue={
						_defaultValue && _defaultValue[id] !== null && _defaultValue[id] !== undefined
							? moment(_defaultValue[id].slice(0, 5), format)
							: null
					}
					placeholder="De"
					format={this.state.format}
					onChange={e => this.getTime(e, 'from', id, _store)}
				/>{' '}
				<TimePicker
					defaultValue={
						_defaultValue && _defaultValue[id] != undefined
							? moment(_defaultValue[id].slice(-5), format)
							: null
					}
					placeholder="à"
					format={this.state.format}
					onChange={e => this.getTime(e, 'to', id, _store)}
				/>
				<Button
					type="link"
					name={name}
					onClick={e => this.add(e.target.name, value, true, _store)}
					style={{ color: 'orange' }}>
					<Icon type="minus" />
				</Button>
			</Button.Group>
		);
	}

	_handleGetAcceptedDay = () => {
		const { isChecked } = this.state;
		const { name } = this.props;
		const _name = typeof name === 'string' ? name : name.props.id;
		isChecked === true
			? this.props.handleGetAcceptedDay(isChecked, store, _name)
			: this.props.handleGetAcceptedDay(false, [], _name);
	};

	getTime(value, type, id, store) {
		if (value !== null && type === 'from') {
			const time = value.format('HH:mm');
			from = time;
		}
		if (value !== null && type === 'to') {
			const time = value.format('HH:mm');
			to = time;
		}
		if (from !== null && to !== null && from < to) {
			store[id] = `${from}-${to}`;
			this.setState({ alert: false });
			this._handleGetAcceptedDay();
		} else {
			store[id] = null;
			this.setState({ alert: true });
		}
	}

	componentDidMount() {
		this.props.editCount && this.setState({ count: this.props.editCount });
	}
	render() {
		const { isChecked, count, format, alert } = this.state;
		const { name, editCount, acceptedDays, _defaultValue } = this.props;
		const _name = typeof name === 'string' ? name : name.props.id;
		!isChecked
			? this.props.handleGetAcceptedDay(false, [], _name)
			: this.props.handleGetAcceptedDay(true, store, _name);
		return (
			<div style={{ paddingBottom: '10px' }}>
				<Form.Item
					//validateState={alert?'error':'success'}
					validateStatus={alert ? 'error' : 'success'}
					help={alert ? 'From must be smaller than to' : ''}>
					<Row style={{ width: '100%' }}>
						<Col md={24} lg={9} xl={6}>
							<Checkbox
								onChange={() => {
									this.setState({ isChecked: !isChecked });
									//this._handleGetAcceptedDay()
								}}
								style={{ wordBreak: 'break-word' }}>
								{name}
							</Checkbox>
						</Col>
						<Col span={24} md={24} lg={15} xl={18}>
							<Button.Group>
								<TimePicker
									defaultValue={
										_defaultValue && _defaultValue[0] !== null && _defaultValue[0] !== undefined
											? moment(_defaultValue[0].slice(0, 5), format)
											: null
									}
									placeholder="De"
									format={format}
									onChange={e => this.getTime(e, 'from', 0, store)}
								/>{' '}
								<TimePicker
									defaultValue={
										_defaultValue && _defaultValue[0] !== null && _defaultValue[0] !== undefined
											? moment(_defaultValue[0].slice(-5), format)
											: null
									}
									placeholder="à"
									format={format}
									onChange={e => this.getTime(e, 'to', 0, store)}
								/>
								<Button type="link" name="count" onClick={e => this.add(e.target.name, count)}>
									<Icon type="plus" />
								</Button>
							</Button.Group>
							<div>{count > 0 && this.row(count, 'count', 1, store)}</div>
							<div>{count > 1 && this.row(count, 'count', 2, store)}</div>
						</Col>
					</Row>
				</Form.Item>
			</div>
		);
	}
}
