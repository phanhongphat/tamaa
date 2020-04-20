import React, { PureComponent } from 'react';
import injectSheet from 'react-jss';

import { Spin } from 'antd';

import styles from './styles';

@injectSheet(styles)
export default class Loading extends PureComponent {
	render() {
		const { classes } = this.props;
		return (
			<div className={classes.container}>
				<Spin size="large" tip="Loading..." className={classes.icon} />
			</div>
		);
	}
}
