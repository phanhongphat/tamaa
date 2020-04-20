import React, { PureComponent, Fragment } from 'react';
import injectSheet from 'react-jss';

import UserLayout from 'src/layout/UserLayout';
import RegisterFrom from 'src/components/Form/Register';

import styles from './styles';

@injectSheet(styles)
export default class RegisterContainer extends PureComponent {
	render() {
		const { classes } = this.props;
		return (
			<UserLayout>
				<div className={classes.main}>
					<RegisterFrom />
				</div>
			</UserLayout>
		);
	}
}
