import React, { PureComponent } from 'react';

import injectSheet from 'react-jss';
import { Input } from 'antd';
import styles from './styles';

// function formatNumber(value) {
// 	value += '';
// 	const list = value.split('.');
// 	const prefix = list[0].charAt(0) === '-' ? '-' : '';
// 	let num = prefix ? list[0].slice(1) : list[0];
// 	let result = '';
// 	while (num.length > 3) {
// 		result = `,${num.slice(-3)}${result}`;
// 		num = num.slice(0, num.length - 3);
// 	}
// 	if (num) {
// 		result = num + result;
// 	}
// 	return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
// }

@injectSheet(styles)
export default class NumericInput extends PureComponent {
	onChange = e => {
		const { value } = e.target;
		// this.props.onChange && this.props.onChange('dailyAmount', Number(value));
		const { negative = true, float = true, onChange } = this.props;
		// console.log(this.props);
		const reg = float ? /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/ : /^-?(0|[1-9][0-9]*)?$/;
		if (negative) {
			if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
				onChange(value);
			}
		} else {
			if ((!isNaN(value) && reg.test(value)) || value === '') {
				onChange(value);
			}
		}
	};

	// '.' at the end or only '-' in the input box.
	onBlur = () => {
		const { value, onBlur, onChange } = this.props;
		if (value && value.length > 0) {
			if (value.charAt(value.length - 1) === '.' || value === '-') {
				onChange(value.slice(0, -1));
			}
			if (onBlur) {
				onBlur();
			}
		}
	};

	render() {
		const { placeholder } = this.props;

		return (
			<Input
				{...this.props}
				onChange={this.onChange}
				onBlur={this.onBlur}
				placeholder={placeholder}
				maxLength={125}
			/>
		);
	}
}
