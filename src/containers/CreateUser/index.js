import React, { PureComponent } from 'react';

import injectSheet from 'react-jss';
import styles from './styles';
import { Layout, Divider, Button, Dropdown, Icon, Input } from 'antd';
import { WrappedHorizontalLoginForm } from './Form';
@injectSheet(styles)
export default class CreateEmployee extends PureComponent {
	render() {
		return (
			<Layout style={{ backgroundColor: 'white' }}>
				<WrappedHorizontalLoginForm />
			</Layout>
		);
	}
}
