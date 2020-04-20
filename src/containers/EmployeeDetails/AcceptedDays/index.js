import React, { PureComponent } from 'react';
import { Row, Col, Checkbox, TimePicker, Button, Icon, Alert } from 'antd';
import styles from '../styles';

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
		return (
			<Button.Group style={{ marginTop: '3px' }}>
				<TimePicker
					defaultValue=""
					placeholder="De"
					format={this.state.format}
					onChange={e => this.getTime(e, 'from', id, _store)}
				/>{' '}
				<TimePicker
					defaultValue=""
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
			store[id] = `${from} - ${to}`;
			this.setState({ alert: false });
		} else {
			store[id] = '';
			this.setState({ alert: true });
		}
	}

	_handleGetAcceptedDay() {
		const { isChecked } = this.state;
		const { name } = this.props;
		typeof name !== 'string'
			? this.props.handleGetAcceptedDay(isChecked, store, name.props.defaultMessage)
			: this.props.handleGetAcceptedDay(isChecked, store, name);
	}

	componentDidMount() {
		this.props.editCount && this.setState({ count: this.props.editCount });
	}

	render() {
		const { isChecked, count, format } = this.state;
		const { name, editCount } = this.props;
		console.log(editCount);
		return (
			<div style={{ paddingBottom: '10px' }}>
				{this.state.alert ? (
					<Alert message="From must be smaller than to" type="error" style={{ width: '60%' }} />
				) : null}
				<Row style={{ width: '100%' }}>
					<Col md={9} lg={9} xl={6}>
						<Checkbox
							onChange={() => {
								this.setState({ isChecked: !isChecked });
								this._handleGetAcceptedDay();
							}}
							style={{ wordBreak: 'break-word' }}>
							{name}
						</Checkbox>
					</Col>
					<Col span={15} style={isChecked ? styles.disabledField : null}>
						<Button.Group>
							<TimePicker
								defaultValue=""
								placeholder="De"
								format={format}
								onChange={e => this.getTime(e, 'from', 0, store)}
							/>{' '}
							<TimePicker
								defaultValue=""
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
			</div>
		);
	}
}
