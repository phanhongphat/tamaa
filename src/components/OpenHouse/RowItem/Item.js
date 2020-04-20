import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Router, Link } from 'src/routes';
import injectSheet from 'react-jss';
import { Form, Icon, Input, Button, Row, Col, TimePicker } from 'antd';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';

import styles from './styles';

const FormItem = Form.Item;

@injectSheet(styles)
@Form.create()
export default class LoginFrom extends Component {
	static propTypes = {};

	static defaultProps = {};

	state = {
		loading: false,
		format: 'HH:mm',
		to: '',
		from: '',
		confirmDirty: false
	};

	shouldComponentUpdate(nextProps, nextState) {
		const deffTo = nextProps.toDefault !== this.props.toDefault;
		const deffFrom = nextProps.fromDefault !== this.props.fromDefault;
		if (deffTo || deffFrom) {
			const { isClosed } = nextProps;
			if (isClosed) {
				const { form } = this.props;
				form.resetFields(['to', 'from']);
			}

			return true;
		}
		return false;
	}

	validateFromTime = (rule, value, callback) => {
		const { form } = this.props;
		const fromTime = moment(value, 'h:mma');
		const toTime = moment(form.getFieldValue('to'), 'h:mma');

		if (!fromTime.isBefore(toTime)) {
			callback('Inconsistent!');
		} else {
			form.resetFields('to');
			callback();
		}
	};

	validateToTime = (rule, value, callback) => {
		const { form } = this.props;
		const toTime = moment(value, 'h:mma');
		const fromTime = moment(form.getFieldValue('from'), 'h:mma');
		if (!fromTime.isBefore(toTime)) {
			callback('Inconsistent!');
		} else {
			form.resetFields('from');
			callback();
		}
	};

	onChange = (e, feild) => {
		if (e === null) {
			this.setState({ [feild]: '' });
		} else {
			this.setState({ [feild]: e.format('HH:mm') });
		}
	};

	render() {
		const { format } = this.state;
		const { classes, index } = this.props;
		const { fromDefault, toDefault, isClosed } = this.props;
		const { getFieldDecorator } = this.props.form;
		return (
			<Form style={{ height: '30px', width: '100%' }}>
				<Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
					{getFieldDecorator('from', {
						rules: [
							{
								required: true,
								message: 'Please select time!'
							},
							{
								validator: this.validateFromTime
							}
						],
						initialValue: moment(fromDefault, 'HH:mm')
					})(
						<TimePicker
							// value={moment(fromDefault, 'HH:mm')}
							inputReadOnly={true}
							format={format}
							minuteStep={15}
							allowClear={false}
							disabled={isClosed}
							onChange={e => this.props.onChange(e, index, 'from')}
						/>
					)}
				</Form.Item>
				<span style={{ display: 'inline-block', width: '24px', textAlign: 'center', lineHeight: '40px' }}>
					-
				</span>
				<Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
					{getFieldDecorator('to', {
						rules: [
							{
								required: true,
								message: 'Please select time!'
							},
							{
								validator: this.validateToTime
							}
						],
						initialValue: moment(toDefault, 'HH:mm')
					})(
						<TimePicker
							// value={moment(toDefault, 'HH:mm')}
							inputReadOnly={true}
							allowClear={false}
							format={format}
							minuteStep={15}
							onChange={e => this.props.onChange(e, index, 'to')}
							disabled={isClosed}
						/>
					)}
					{/* <TimePicker
						value={moment(toDefault, 'HH:mm')}
						// data-feild="from"
						// index={index}
						format={format}
						// disabled={`${isCheck}`}
						onChange={e => this.props.onChange(e, index, 'to')}
					/> */}
				</Form.Item>
			</Form>
		);
	}
}
