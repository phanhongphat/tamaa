import React, { Component } from 'react';
import injectSheet from 'react-jss';
import map from 'lodash/map';
import { Modal } from 'antd';

const { confirm } = Modal;

import NormalDay from 'src/components/OpenHouse/NormalDay';
import Exception from 'src/components/OpenHouse/Exception';

import styles from './styles';

@injectSheet(styles)
export default class OpenHouse extends Component {
	state = {
		normalDay: {
			monday: ['00:00-00:00'],
			tuesday: ['00:00-00:00'],
			wednesday: ['00:00-00:00'],
			thursday: ['00:00-00:00'],
			friday: ['00:00-00:00'],
			saturday: ['00:00-00:00'],
			sunday: ['00:00-00:00']
		},
		exceptions: {
			// '2016-12-25': ['00:01-23:00'],
			// '2019-07-25': ['00:01-23:00']
		}
	};

	updateNormalDay = data => {
		this.setState({ normalDay: data }, () => {
			this.updateOutPutData();
		});
	};

	updateExceptionDay = data => {
		this.setState({ exceptions: data }, () => {
			this.updateOutPutData();
		});
	};

	updateOutPutData = () => {
		const { normalDay, exceptions } = this.state;
		const outPut = {
			...normalDay,
			...exceptions
		};
		// console.log(outPut);
		if (typeof this.props.setDataOutput === 'function') {
			this.props.setDataOutput(outPut);
		}
	};

	applyAllFeild = () => {
		const { normalDay, exceptions } = this.state;
		console.log('normal ===>', normalDay);
		console.log('exceptions ===>', exceptions);
		const data = normalDay.monday;
		const seft = this;

		confirm({
			title: 'Voulez-vous vraiment appliquer lundi tous les jours',

			onOk() {
				console.log('OK');

				// if (typeof seft.props.setDataOutput === 'function') {
				// }
				map(normalDay, (value, key) => {
					normalDay[key] = data;
				});
				map(exceptions, (value, key) => {
					exceptions[key] = data;
				});
				seft.setState(
					{
						normalDay: { ...normalDay },
						exceptions: { ...exceptions }
					},
					() => seft.updateOutPutData()
				);
			},
			onCancel() {
				return;
			}
		});
	};

	componentDidMount() {
		const { normalDay, exceptions, isEdit } = this.props;
		normalDay && normalDay !== undefined && this.setState({ normalDay });
		exceptions && exceptions !== undefined && this.setState({ exceptions });
	}

	render() {
		const { classes } = this.props;
		const { normalDay, exceptions } = this.state;

		return (
			<div className={classes.container}>
				<NormalDay updateNormalDay={this.updateNormalDay} data={normalDay} applyAllFeild={this.applyAllFeild} />
				<Exception updateExceptionDay={this.updateExceptionDay} data={exceptions} />
			</div>
		);
	}
}
